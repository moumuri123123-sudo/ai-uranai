import { GoogleGenAI } from "@google/genai";
import type { FortuneGrade, ZodiacDetail, ZodiacRanking } from "./daily-ranking";

// 順位に応じたフォールバック評価
function fallbackGrade(rank: number, offset: number): FortuneGrade {
  const adjusted = rank + offset;
  if (adjusted <= 4) return "◎";
  if (adjusted <= 8) return "○";
  return "△";
}

function fallbackDetail(name: string, rank: number): ZodiacDetail {
  const colors = ["赤", "青", "金", "白", "緑", "紫", "黄", "ピンク"];
  const items = ["手帳", "ペン", "ハンカチ", "時計", "ノート", "アクセサリー", "香水", "お守り"];
  const times = ["午前中", "正午", "午後3時頃", "夕方", "夜"];
  const seed = (name.charCodeAt(0) + rank) % 8;

  return {
    work: fallbackGrade(rank, 0),
    love: fallbackGrade(rank, 1),
    money: fallbackGrade(rank, -1),
    lucky_color: colors[seed % colors.length],
    lucky_item: items[seed % items.length],
    lucky_time: times[seed % times.length],
    detail:
      rank <= 4
        ? "積極的に行動することで運気が上がりそう。チャンスを見逃さないで。"
        : rank <= 8
        ? "穏やかに過ごすのが吉。小さな幸せに目を向けて。"
        : "焦らず一歩ずつ進もう。周囲への感謝を忘れずに。",
  };
}

function isValidGrade(s: unknown): s is FortuneGrade {
  return s === "◎" || s === "○" || s === "△";
}

// Geminiで12星座分の詳細運勢を一括生成
export async function generateAllDetails(
  rankings: ZodiacRanking[],
): Promise<Map<string, ZodiacDetail>> {
  const result = new Map<string, ZodiacDetail>();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    rankings.forEach((z) => result.set(z.key, fallbackDetail(z.name, z.rank)));
    return result;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const zodiacList = rankings
      .map((z) => `${z.rank}位: ${z.name}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `以下の12星座の今日の運勢ランキングに、それぞれ詳細運勢を生成してください。\n\n${zodiacList}\n\nJSON形式で返してください。`,
      config: {
        systemInstruction: `あなたは占処（うらないどころ）の占い師です。
12星座それぞれの今日の詳細運勢をJSON形式で生成してください。

【出力形式】
{
  "牡羊座": {
    "work": "◎",
    "love": "○",
    "money": "△",
    "lucky_color": "赤",
    "lucky_item": "手帳",
    "lucky_time": "午前中",
    "detail": "仕事で新しいチャンスが巡ってきそう。積極的に動いて。"
  },
  ...
}

【ルール】
- 12星座すべて含める
- work/love/money は「◎」「○」「△」のいずれか
- 上位の星座ほど◎が多く、下位は△が多い傾向に
- lucky_color は「赤」「青」など日本語の色名1〜3文字
- lucky_item は「手帳」「香水」など身近なもの1〜5文字
- lucky_time は「午前中」「夕方」など時間帯の表現
- detail は40〜60文字、前向きなアドバイス、絵文字・マークダウン不使用
- JSONのみ返す、説明文や\`\`\`は不要`,
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text) as Record<string, unknown>;
      for (const z of rankings) {
        const d = parsed[z.name];
        if (d && typeof d === "object") {
          const obj = d as Record<string, unknown>;
          if (
            isValidGrade(obj.work) &&
            isValidGrade(obj.love) &&
            isValidGrade(obj.money) &&
            typeof obj.lucky_color === "string" &&
            typeof obj.lucky_item === "string" &&
            typeof obj.lucky_time === "string" &&
            typeof obj.detail === "string"
          ) {
            result.set(z.key, {
              work: obj.work,
              love: obj.love,
              money: obj.money,
              lucky_color: obj.lucky_color,
              lucky_item: obj.lucky_item,
              lucky_time: obj.lucky_time,
              detail: obj.detail,
            });
            continue;
          }
        }
        result.set(z.key, fallbackDetail(z.name, z.rank));
      }
      return result;
    }
  } catch {
    // Gemini失敗時はフォールバック
  }

  rankings.forEach((z) => result.set(z.key, fallbackDetail(z.name, z.rank)));
  return result;
}

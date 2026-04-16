import {
  getDailyRanking,
  getFallbackComment,
  getRankingDiff,
} from "@/lib/daily-ranking";
import { generateAllDetails } from "@/lib/ranking-details";
import { rankingJsonLd } from "@/lib/jsonld";
import { GoogleGenAI } from "@google/genai";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import RankingList from "./RankingList";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { month, day, rankings } = getDailyRanking();
  const topName = rankings[0]?.name || "";
  const title = `今日の星座占いランキング【${month}月${day}日】| 占処`;
  const description = `${month}月${day}日の12星座ランキング。今日の1位は${topName}！仕事運・恋愛運・金運やラッキーアイテムも毎朝更新。`;
  return {
    title,
    description,
    alternates: {
      canonical: "/daily-ranking",
    },
    openGraph: {
      title,
      description,
      url: "https://uranaidokoro.com/daily-ranking",
    },
  };
}

// 毎日更新（ISR: 5分ごとに再生成）
// トレードオフ: 3600 (1時間) だと 0:00 JST のランキング切り替わりが最大1時間遅延して
// 古いデータが表示されてしまう。300 (5分) にすることで日付切り替えが確実に5分以内に
// 反映される。Geminiの呼び出し頻度は上がるが、再生成コストよりも正確性を優先する。
export const revalidate = 300;

// Geminiで全星座の一言コメントを生成
async function generateAllComments(
  rankings: { name: string; rank: number }[],
): Promise<Map<string, string>> {
  const comments = new Map<string, string>();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return comments;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const zodiacList = rankings
      .map((z) => `${z.rank}位: ${z.name}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `以下の12星座の今日の運勢ランキングに、それぞれ一言コメントを付けてください。\n\n${zodiacList}`,
      config: {
        systemInstruction: `あなたは占処（うらないどころ）の占い師です。
12星座それぞれに今日の一言コメントを書いてください。

【ルール】
- 1行に「星座名:コメント」の形式で12行出力
- コメントは15文字以内
- 「！」で終える
- 絵文字は使わない
- マークダウンは使わない
- 上位は前向きでワクワクする内容、下位は「気をつけて」「慎重に」など注意喚起しつつ前向き
- 例：「直感が冴える一日！」「恋に追い風の日！」「焦らず一歩ずつ！」`,
      },
    });

    const text = response.text?.trim();
    if (text) {
      for (const line of text.split("\n")) {
        const match = line.match(/(.+?)[：:](.+)/);
        if (match) {
          const name = match[1].trim();
          const comment = match[2].trim();
          if (comment.length <= 25) {
            comments.set(name, comment);
          }
        }
      }
    }
  } catch {
    // Gemini失敗時はフォールバック
  }

  return comments;
}

export default async function DailyRankingPage() {
  const { rankings, month, day } = getDailyRanking();
  const diff = getRankingDiff();

  // 一言コメントと詳細運勢を並列で取得
  const [comments, details] = await Promise.all([
    generateAllComments(rankings),
    generateAllDetails(rankings),
  ]);

  const items = rankings.map((z, i) => ({
    ...z,
    oneLiner: comments.get(z.name) || getFallbackComment(i + 1, day),
    detail: details.get(z.key)!,
    diff: diff.get(z.key) || 0,
  }));

  const jsonLd = rankingJsonLd({
    month,
    day,
    rankings: rankings.map((z) => ({ name: z.name, rank: z.rank })),
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ヘッダー */}
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm tracking-widest text-muted">
          ━━━ 毎朝7時更新 ━━━
        </p>
        <h1 className="font-mincho mb-2 text-3xl font-bold tracking-wider text-neon-red sm:text-4xl">
          今日の運勢ランキング
        </h1>
        <p className="font-yuji text-xl text-gold">
          {month}月{day}日
        </p>
        <p className="mt-2 text-xs text-muted">
          星座をタップすると詳細運勢が開きます
        </p>
      </div>

      {/* ランキングリスト */}
      <RankingList items={items} />

      {/* 自分の星座を占うリンク */}
      <div className="mt-8 text-center">
        <Link
          href="/zodiac"
          className="inline-block rounded-full border-2 border-neon-red/50 px-8 py-3 text-base font-bold text-neon-red transition-colors hover:bg-neon-red/10"
        >
          自分の星座について詳しく占う
        </Link>
      </div>

      {/* 広告 */}
      <div className="mt-8">
        <AdBanner slot="ranking-bottom" />
      </div>

      {/* 補足 */}
      <div className="mt-8 rounded-xl border border-border bg-surface p-6 text-center">
        <p className="mb-4 text-sm text-muted">
          もっと詳しく占いたい方はこちら
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/tarot"
            className="rounded-full border border-neon-red/30 px-4 py-2 text-sm text-neon-red transition-colors hover:bg-neon-red/10"
          >
            タロット占い
          </Link>
          <Link
            href="/numerology"
            className="rounded-full border border-neon-purple/30 px-4 py-2 text-sm text-neon-purple transition-colors hover:bg-neon-purple/10"
          >
            数秘術
          </Link>
        </div>
      </div>

      {/* 注意書き */}
      <p className="mt-6 text-center text-xs text-muted">
        ※ランキングはAIによるエンタメ占いです。毎朝7時に更新されます。
      </p>
    </div>
  );
}

import { GoogleGenAI } from "@google/genai";

export type TweetSlot = "midday" | "evening" | "night";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

// JSTでの日付取得
export function getJstDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

// 年始からの通算日数（JST）
export function getDayOfYearJst(): number {
  const jst = getJstDate();
  const start = Date.UTC(jst.getUTCFullYear(), 0, 0);
  const diff = jst.getTime() - start;
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}

export function getJstDateString(): string {
  const jst = getJstDate();
  return `${jst.getUTCFullYear()}-${String(jst.getUTCMonth() + 1).padStart(2, "0")}-${String(jst.getUTCDate()).padStart(2, "0")}`;
}

// 夢占いトレンド宣伝ツイート（3日に1回evening枠で差し替え）
export function getDreamTrendsTweet(): string {
  const patterns = [
    `🌙 今月みんなが見た夢は？

占処の「夢占いトレンド」で
匿名集計されたワード雲をチェック。
気になる夢を見た人が他にも…？

https://uranaidokoro.com/dream-trends

#夢占い #占処`,
    `✨ 夢占いトレンド更新中

あなたが見た夢、実は今月流行ってるかも？
ワードをタップで即占い。

https://uranaidokoro.com/dream-trends

#夢占い #AI占い`,
    `🌙 「最近こんな夢を見た」
を匿名で共有する占処の新機能。

今月よく見られている夢ランキング、
トップの夢が意外すぎるかも…🔮

https://uranaidokoro.com/dream-trends

#占い #夢占い`,
  ];
  const idx = Math.floor(getDayOfYearJst() / 3) % patterns.length;
  return patterns[idx];
}

// evening枠で夢占いトレンド宣伝を出す日かどうか
export function shouldPromoteDreamTrends(): boolean {
  return getDayOfYearJst() % 3 === 0;
}

// Geminiでスロット別のオリジナルツイート生成
// slotとdateを組み合わせてシード的に使い、毎日違う内容を生成する
export async function generateTweetForSlot(slot: TweetSlot): Promise<string> {
  if (!ai) {
    return getFallbackTweet(slot);
  }

  const slotConfig: Record<
    TweetSlot,
    { theme: string; style: string; topics: string[] }
  > = {
    midday: {
      theme: "お昼の一言運勢アドバイス",
      style: "明るく前向き、午後も頑張れる背中を押す感じ",
      topics: [
        "今日の幸運を呼び込むちょっとした行動",
        "お昼休みにできる開運アクション",
        "午後の集中力を上げる心の整え方",
        "ランチタイムで運気を上げる食べ物の話",
        "今日出会う人との縁を大切にするヒント",
      ],
    },
    evening: {
      theme: "占いにまつわる豆知識・神秘の雑学",
      style: "興味深く、ちょっと学びになる、レトロで奥深い語り口",
      topics: [
        "タロットカードの歴史に関する意外な豆知識",
        "星座の由来になった神話の紹介",
        "数秘術の数字が持つ深い意味",
        "東洋と西洋の占いの違い",
        "古代から続く占いの不思議なエピソード",
      ],
    },
    night: {
      theme: "明日の運気予告・夜の静かなメッセージ",
      style: "しっとりと穏やか、明日への期待を抱かせる詩的な雰囲気",
      topics: [
        "明日訪れるかもしれない小さなチャンス",
        "夜寝る前に唱えるとよい前向きな言葉",
        "翌朝の目覚めを良くするおまじない",
        "月の満ち欠けと運気の関係",
        "夜に整えるべき心の向き合い方",
      ],
    },
  };

  const cfg = slotConfig[slot];
  // 日付×スロット×トピック数で毎日違うトピックを選ぶ
  const topicIdx = (getDayOfYearJst() + slot.charCodeAt(0)) % cfg.topics.length;
  const topic = cfg.topics[topicIdx];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `テーマ: ${cfg.theme}
今日の話題: ${topic}
本日の日付: ${getJstDateString()}

上記の話題に沿って、Xに投稿する占いアカウントのツイートを作成してください。`,
      config: {
        systemInstruction: `あなたは「占処（うらないどころ）」というレトロな和風AI占いサイトのX担当です。
以下のルールを厳守してツイート本文を書いてください：

【ルール】
- 文体: ${cfg.style}
- 全角140文字以内（絵文字やURLも含めて）
- 最後に #占処 #占い のハッシュタグを必ず付ける（他のハッシュタグは最大1つまで追加可）
- 絵文字は1〜3個まで
- 「当たる」「絶対」「必ず」などの断定表現は使わない（景表法対応）
- 医療・金融・法律の助言はしない
- マークダウンは使わない
- URL・リンクは含めない
- 占処のサイトを宣伝しすぎず、占いそのものの魅力を伝える
- 毎日違う切り口で、同じ表現の繰り返しを避ける

【サイト情報】
- サイト名: 占処（うらないどころ）
- 特徴: 6つのAI占い（タロット・星座・相性・MBTI・夢占い・数秘術）をレトロネオンデザインで提供

本文のみを返してください。挨拶や説明は一切不要です。`,
      },
    });

    const text = response.text?.trim();
    if (text && text.length > 10 && text.length <= 140) {
      return text;
    }
    return getFallbackTweet(slot);
  } catch (err) {
    console.error("generateTweetForSlot error:", err);
    return getFallbackTweet(slot);
  }
}

// Gemini利用不可時のフォールバック（毎日違うものを選ぶ）
function getFallbackTweet(slot: TweetSlot): string {
  const fallbacks: Record<TweetSlot, string[]> = {
    midday: [
      "🌞 お昼時は一息ついて深呼吸。小さなひと呼吸が午後の運気を整えてくれます。\n\n#占処 #占い",
      "☕ ランチの後は窓の外を3秒眺めてみて。視界を変えるだけで気持ちも変わります。\n\n#占処 #占い",
      "🌼 今日すれ違った誰かの笑顔、覚えていますか？ささやかな縁が運気の種になります。\n\n#占処 #占い",
    ],
    evening: [
      "🔮 タロットの「愚者」は無謀じゃない、真っ白な可能性の象徴なんです。\n\n#占処 #占い",
      "🌙 星座占いのルーツは古代バビロニア。3000年以上語り継がれてきた物語です。\n\n#占処 #占い",
      "✨ 数秘術で「7」は探求者の数字。内省と学びを大切にする時期かもしれません。\n\n#占処 #占い",
    ],
    night: [
      "🌌 明日は深呼吸から始めてみて。小さな習慣が1日の運気を整えてくれます。\n\n#占処 #占い",
      "🌙 眠る前の一言：「今日もよくやった」。自分に優しくする夜が、明日を変えます。\n\n#占処 #占い",
      "⭐ 夜空に月を見つけたら、そっと願いごとを。静かな時間が運気を育てます。\n\n#占処 #占い",
    ],
  };
  const list = fallbacks[slot];
  return list[getDayOfYearJst() % list.length];
}

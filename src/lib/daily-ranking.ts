// 12星座の運勢ランキングを日付ベースで決定的に生成
// 同じ日付なら常に同じ順位になる（X投稿とページで一致させるため）

export interface ZodiacRanking {
  key: string;
  name: string;
  emoji: string;
  rank: number;
}

const ZODIACS = [
  { key: "aries", name: "牡羊座", emoji: "\u2648" },
  { key: "taurus", name: "牡牛座", emoji: "\u2649" },
  { key: "gemini", name: "双子座", emoji: "\u264A" },
  { key: "cancer", name: "蟹座", emoji: "\u264B" },
  { key: "leo", name: "獅子座", emoji: "\u264C" },
  { key: "virgo", name: "乙女座", emoji: "\u264D" },
  { key: "libra", name: "天秤座", emoji: "\u264E" },
  { key: "scorpio", name: "蠍座", emoji: "\u264F" },
  { key: "sagittarius", name: "射手座", emoji: "\u2650" },
  { key: "capricorn", name: "山羊座", emoji: "\u2651" },
  { key: "aquarius", name: "水瓶座", emoji: "\u2652" },
  { key: "pisces", name: "魚座", emoji: "\u2653" },
];

// 日付文字列からシード値を生成
function dateToSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// シードベースのシャッフル（Fisher-Yates）
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 今日の日付文字列を取得（JST）
function getTodayStr(): string {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return `${y}-${m}-${d}`;
}

// 今日のランキングを取得
export function getDailyRanking(): {
  rankings: ZodiacRanking[];
  month: number;
  day: number;
} {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  const dateStr = getTodayStr();
  const seed = dateToSeed(dateStr);
  const shuffled = seededShuffle(ZODIACS, seed);

  return {
    rankings: shuffled.map((z, i) => ({ ...z, rank: i + 1 })),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

// X投稿用のテキストを生成（上位3位のみ）
export function formatRankingForTweet(): string {
  const { rankings, month, day } = getDailyRanking();
  const top3 = rankings.slice(0, 3);
  const medals = ["🥇", "🥈", "🥉"];

  return `＼ ${month}/${day} 今日の運勢ランキング ／

${top3.map((z, i) => `${medals[i]} ${z.name}`).join("\n")}

4位〜12位はこちら
→ https://uranaidokoro.com/daily-ranking

#今日の運勢 #星座占い`;
}

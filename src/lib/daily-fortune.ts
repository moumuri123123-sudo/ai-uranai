export type DailyFortuneData = {
  dateLabel: string;
  message: string;
  luckyColorName: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
  starRating: number;
};

// 日付文字列から簡易ハッシュ値を生成（決定論的）
function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash * 31 + char) | 0;
  }
  return Math.abs(hash);
}

// ハッシュから範囲内の数値を取得
function pick(hash: number, salt: number, max: number): number {
  return Math.abs((hash * 7919 + salt * 104729) | 0) % max;
}

const messages = [
  "新しい出会いが運命を動かす予感。心を開いて過ごしましょう。",
  "直感が冴えわたる一日。迷ったら最初に感じたことを信じて。",
  "小さな親切が大きな幸運を呼び込みます。周りへの感謝を忘れずに。",
  "長く温めていた計画を動かす絶好のタイミングです。",
  "穏やかな時間が心を癒してくれる日。ゆっくり自分と向き合って。",
  "思いがけないところから嬉しい知らせが届きそうです。",
  "あなたの言葉が誰かの心を救います。素直な気持ちを伝えましょう。",
  "挑戦する勇気が道を切り拓く日。一歩踏み出してみて。",
  "過去の努力が実を結ぶ兆し。自分を信じて進みましょう。",
  "身近な人との絆が深まる一日。大切な人に連絡してみては。",
  "創造力が湧き上がるクリエイティブな日。思いつきを形にしてみて。",
  "金運に恵まれる暗示。お金の使い方を見直すと良い発見があるかも。",
  "健康運が上昇中。体を動かすと気持ちもスッキリします。",
  "古い習慣を手放すと新しい風が入ってきます。断捨離がおすすめ。",
  "人前で注目を浴びるチャンス到来。堂々と自分を表現しましょう。",
  "静かに読書や学びに没頭すると大きな気づきが得られます。",
  "旅行や外出に吉。いつもと違う道を歩くと素敵な発見がありそう。",
  "チームワークが成功のカギ。周りと協力して乗り越えましょう。",
  "自分磨きに最適な日。新しいスキルや趣味を始めてみては。",
  "感情を大切にする日。泣きたい時は泣いて、笑いたい時は笑って。",
  "意外な場所に幸運が隠れています。視野を広く持ちましょう。",
  "コミュニケーション運が最高潮。伝えたかったことを言葉にして。",
  "地道な努力が認められる兆し。コツコツ続けてきたことが報われます。",
  "恋愛運アップの暗示。素直な気持ちが相手の心に届きます。",
  "変化を恐れず受け入れると、想像以上の未来が待っています。",
  "周りの人のアドバイスに耳を傾けて。思わぬヒントが見つかるかも。",
  "芸術や音楽に触れると心が豊かになる一日。感性を磨きましょう。",
  "忍耐力が試される場面も。焦らず落ち着いて対処すれば大丈夫。",
  "夢や目標を紙に書くと実現に近づく日。ビジョンを明確にして。",
  "笑顔が最強のお守りになる日。たくさん笑って幸運を引き寄せて。",
  "自然の中で過ごすとエネルギーがチャージされます。深呼吸を大切に。",
  "ひらめきが降りてくる予感。メモを手元に置いておきましょう。",
];

const luckyColors = [
  { name: "紅色", color: "#dc143c" },
  { name: "金色", color: "#ffd700" },
  { name: "桜色", color: "#ffb7c5" },
  { name: "藍色", color: "#264348" },
  { name: "翡翠色", color: "#00a86b" },
  { name: "山吹色", color: "#f8b400" },
  { name: "紫色", color: "#884898" },
  { name: "空色", color: "#87ceeb" },
  { name: "珊瑚色", color: "#f08080" },
  { name: "白銀色", color: "#c0c0c0" },
  { name: "若草色", color: "#8db255" },
  { name: "群青色", color: "#4169e1" },
];

const directions = [
  "東", "西", "南", "北",
  "北東", "北西", "南東", "南西",
];

const monthKanji = [
  "", "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

function dayToKanji(day: number): string {
  if (day <= 10) {
    const nums = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    return nums[day] + "日";
  }
  if (day <= 19) {
    const nums = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    return "十" + nums[day - 10] + "日";
  }
  if (day === 20) return "二十日";
  if (day <= 29) {
    const nums = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    return "二十" + nums[day - 20] + "日";
  }
  if (day === 30) return "三十日";
  return "三十一日";
}

export function getDailyFortune(date?: Date): DailyFortuneData {
  const now = date || new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dateStr = `${year}-${month}-${day}`;
  const hash = hashDate(dateStr);

  const messageIdx = pick(hash, 1, messages.length);
  const colorIdx = pick(hash, 2, luckyColors.length);
  const dirIdx = pick(hash, 3, directions.length);
  const luckyNum = pick(hash, 4, 9) + 1;
  const star = pick(hash, 5, 3) + 3; // 3〜5

  return {
    dateLabel: `${monthKanji[month]}${dayToKanji(day)}`,
    message: messages[messageIdx],
    luckyColorName: luckyColors[colorIdx].name,
    luckyColor: luckyColors[colorIdx].color,
    luckyNumber: luckyNum,
    luckyDirection: directions[dirIdx],
    starRating: star,
  };
}

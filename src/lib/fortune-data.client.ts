// クライアント用の軽量データ（タロットカード名 + 画像パス）
// サーバーで必要な meaning / reversedMeaning は除外し、
// クライアントバンドルサイズを削減する。

export type TarotCard = {
  name: string;
  image: string;
};

// Rider-Waite Tarot メジャーアルカナ22枚
// 画像は public/images/tarot/ 配下（パブリックドメイン、Wikimedia Commons由来）
export const tarotCards: TarotCard[] = [
  { name: "愚者", image: "/images/tarot/00-fool.webp" },
  { name: "魔術師", image: "/images/tarot/01-magician.webp" },
  { name: "女教皇", image: "/images/tarot/02-high-priestess.webp" },
  { name: "女帝", image: "/images/tarot/03-empress.webp" },
  { name: "皇帝", image: "/images/tarot/04-emperor.webp" },
  { name: "教皇", image: "/images/tarot/05-hierophant.webp" },
  { name: "恋人", image: "/images/tarot/06-lovers.webp" },
  { name: "戦車", image: "/images/tarot/07-chariot.webp" },
  { name: "力", image: "/images/tarot/08-strength.webp" },
  { name: "隠者", image: "/images/tarot/09-hermit.webp" },
  { name: "運命の輪", image: "/images/tarot/10-wheel-of-fortune.webp" },
  { name: "正義", image: "/images/tarot/11-justice.webp" },
  { name: "吊るされた男", image: "/images/tarot/12-hanged-man.webp" },
  { name: "死神", image: "/images/tarot/13-death.webp" },
  { name: "節制", image: "/images/tarot/14-temperance.webp" },
  { name: "悪魔", image: "/images/tarot/15-devil.webp" },
  { name: "塔", image: "/images/tarot/16-tower.webp" },
  { name: "星", image: "/images/tarot/17-star.webp" },
  { name: "月", image: "/images/tarot/18-moon.webp" },
  { name: "太陽", image: "/images/tarot/19-sun.webp" },
  { name: "審判", image: "/images/tarot/20-judgement.webp" },
  { name: "世界", image: "/images/tarot/21-world.webp" },
];

export const tarotCardNames: string[] = tarotCards.map((c) => c.name);

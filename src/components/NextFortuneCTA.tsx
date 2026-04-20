import Link from "next/link";

type FortuneType = "tarot" | "zodiac" | "mbti" | "compatibility" | "numerology" | "dream";

type NextFortuneCTAProps = {
  currentFortune: FortuneType;
};

type FortuneInfo = {
  href: string;
  label: string;
  pitch: string;
  icon: string;
};

// 占いメニューごとの訴求文とリンク。
const FORTUNE_INFO: Record<FortuneType, FortuneInfo> = {
  tarot: {
    href: "/tarot",
    label: "タロット占い",
    pitch: "22枚の大アルカナから、いま必要なメッセージを1枚引き。",
    icon: "\u{1F0CF}",
  },
  zodiac: {
    href: "/zodiac",
    label: "星座占い",
    pitch: "12星座が示す、今月・今年のあなたの流れを読み解きます。",
    icon: "\u{2728}",
  },
  mbti: {
    href: "/mbti",
    label: "MBTI占い",
    pitch: "16タイプの性格診断から、恋愛・仕事の傾向を深掘り。",
    icon: "\u{1F9E9}",
  },
  compatibility: {
    href: "/compatibility",
    label: "相性占い",
    pitch: "お二人の名前から、関係性の行方をじっくり鑑定します。",
    icon: "\u{1F493}",
  },
  numerology: {
    href: "/numerology",
    label: "数秘術",
    pitch: "生年月日に刻まれた運命数から、人生の使命を紐解きます。",
    icon: "\u{1F522}",
  },
  dream: {
    href: "/dream",
    label: "夢占い",
    pitch: "見た夢のキーワードから、深層心理のメッセージを読み解きます。",
    icon: "\u{1F319}",
  },
};

// 占い種別 → おすすめブログ記事（slug + タイトル）
// src/lib/blog-data.ts に存在するslugのみ使用すること。
const RELATED_ARTICLES: Record<FortuneType, Array<{ slug: string; title: string }>> = {
  tarot: [
    { slug: "tarot-major-arcana-meanings", title: "タロット大アルカナ22枚の意味完全ガイド" },
    { slug: "tarot-spread-guide", title: "タロットのスプレッド（展開法）入門" },
  ],
  zodiac: [
    { slug: "zodiac-2026-horoscope", title: "2026年 12星座別の運勢" },
    { slug: "zodiac-elements-guide", title: "12星座のエレメント（火・地・風・水）入門" },
  ],
  mbti: [
    { slug: "mbti-basic-guide", title: "MBTI16タイプ基礎ガイド" },
    { slug: "mbti-compatibility", title: "MBTIタイプ別の相性" },
  ],
  compatibility: [
    { slug: "compatibility-improve-tips", title: "相性を良くする7つのコツ" },
    { slug: "compatibility-birthday", title: "誕生日でわかる二人の相性" },
  ],
  numerology: [
    { slug: "numerology-life-path-guide", title: "数秘術・ライフパスナンバー入門" },
    { slug: "numerology-birthday-number", title: "誕生日から読み解くバースデーナンバー" },
  ],
  dream: [
    { slug: "dream-interpretation-guide", title: "夢占い入門 代表的なシンボル" },
    { slug: "dream-recurring-meaning", title: "繰り返し見る夢の意味" },
  ],
};

// 現在の占い種別を除いた2つを選ぶ（順序は定義順に従う）。
function pickOtherFortunes(current: FortuneType): FortuneType[] {
  const order: FortuneType[] = ["tarot", "zodiac", "mbti", "compatibility", "numerology", "dream"];
  return order.filter((t) => t !== current).slice(0, 2);
}

export default function NextFortuneCTA({ currentFortune }: NextFortuneCTAProps) {
  const others = pickOtherFortunes(currentFortune);
  const articles = RELATED_ARTICLES[currentFortune];

  return (
    <section
      aria-label="次の占い・関連記事のご案内"
      className="my-8 rounded-2xl border border-gold/30 bg-surface/60 p-5 shadow-lg shadow-gold/5 sm:p-6"
    >
      <div className="mb-5 text-center">
        <p className="mb-1 text-[10px] tracking-widest text-gold/80" aria-hidden="true">
          &mdash; NEXT &mdash;
        </p>
        <h3 className="font-mincho text-base font-semibold text-warm sm:text-lg">
          もう少し、占ってみませんか？
        </h3>
      </div>

      {/* 他の占いメニュー */}
      <ul className="grid gap-3 sm:grid-cols-2">
        {others.map((type) => {
          const info = FORTUNE_INFO[type];
          return (
            <li key={type}>
              <Link
                href={info.href}
                className="group flex h-full min-h-[5.5rem] items-start gap-3 rounded-xl border border-border bg-[#0a0408] p-4 transition-all hover:border-neon-red/50 hover:shadow-lg hover:shadow-neon-red/10 active:scale-[0.98]"
              >
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 text-2xl leading-none text-gold"
                >
                  {info.icon}
                </span>
                <span className="flex flex-col">
                  <span className="font-mincho text-sm font-bold text-foreground group-hover:text-neon-red transition-colors">
                    {info.label}
                  </span>
                  <span className="mt-1 text-xs leading-relaxed text-muted">
                    {info.pitch}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 関連ブログ記事 */}
      {articles.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-2 text-xs font-medium text-gold">関連コラム</p>
          <ul className="space-y-1.5">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-warm hover:text-neon-red transition-colors"
                >
                  <span aria-hidden="true" className="text-gold/70">&rsaquo;</span>
                  <span className="underline decoration-border decoration-dotted underline-offset-2">
                    {a.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

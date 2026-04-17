import Link from "next/link";

type AffiliateCTAProps = {
  /** 占い種別ごとに適したメッセージを出し分ける */
  fortuneType?: "tarot" | "zodiac" | "compatibility" | "mbti" | "dream" | "numerology" | "general";
  /** 表示バリアント */
  variant?: "default" | "compact";
};

// 占い種別ごとのコピー・訴求ポイント
const COPY_BY_TYPE: Record<
  NonNullable<AffiliateCTAProps["fortuneType"]>,
  { headline: string; sub: string }
> = {
  tarot: {
    headline: "カードが指し示した深い意味を、本物の占い師とじっくり掘り下げてみませんか？",
    sub: "AIでは届かない繊細な心のひだを、経験豊富な占い師が丁寧に読み解きます。",
  },
  zodiac: {
    headline: "星の巡りが教える今後の流れ、プロの占星術師と語り合ってみませんか？",
    sub: "あなただけのホロスコープを、占星術師が時間をかけて鑑定します。",
  },
  compatibility: {
    headline: "お二人の相性の未来について、恋愛専門の占い師に相談してみませんか？",
    sub: "実際の年齢・環境・経緯まで踏まえた、心に寄り添う鑑定が受けられます。",
  },
  mbti: {
    headline: "性格タイプから見えた恋愛・仕事の悩み、人生経験豊富な占い師と向き合いませんか？",
    sub: "AIでは難しい「あなた自身の物語」を一緒に紡ぎ直します。",
  },
  dream: {
    headline: "見た夢が気になって眠れない…そんなとき、夢占い専門の占い師に話してみませんか？",
    sub: "深層心理に詳しい占い師が、夢のメッセージを丁寧に読み解きます。",
  },
  numerology: {
    headline: "生年月日に刻まれた運命、数秘術の専門家と一緒に紐解いてみませんか？",
    sub: "あなたの人生の使命を、経験豊富な占い師がじっくり鑑定します。",
  },
  general: {
    headline: "本物の占い師と直接話してみたい方へ",
    sub: "AIでは届かない心の深い部分を、プロの占い師が丁寧に向き合います。",
  },
};

// アフィリリンクは環境変数で管理。未設定時はリンク無しで誘導テキストのみ表示。
// NEXT_PUBLIC_AFFILIATE_URL_PHONE: 電話占い大手のアフィリURL（A8.net/afb等で取得）
// NEXT_PUBLIC_AFFILIATE_URL_CHAT:  チャット占い（LINEトーク占い等）
export default function AffiliateCTA({ fortuneType = "general", variant = "default" }: AffiliateCTAProps) {
  const copy = COPY_BY_TYPE[fortuneType];
  const phoneUrl = process.env.NEXT_PUBLIC_AFFILIATE_URL_PHONE || "";
  const chatUrl = process.env.NEXT_PUBLIC_AFFILIATE_URL_CHAT || "";

  // どちらも未設定なら非表示（AdSenseポリシー・景表法的にダミーは避ける）
  if (!phoneUrl && !chatUrl) return null;

  if (variant === "compact") {
    return (
      <section aria-label="占い師相談のご案内" className="my-6 rounded-xl border border-neon-red/30 bg-surface/50 p-4 text-center">
        <p className="mb-3 text-xs text-warm">{copy.headline}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {phoneUrl && (
            <Link
              href={phoneUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="min-h-11 rounded-full border border-neon-red bg-neon-red/10 px-5 py-2 text-xs font-semibold text-neon-red transition-all hover:bg-neon-red/20 active:scale-95"
            >
              電話占いで相談する
            </Link>
          )}
          {chatUrl && (
            <Link
              href={chatUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="min-h-11 rounded-full border border-gold bg-gold/10 px-5 py-2 text-xs font-semibold text-gold transition-all hover:bg-gold/20 active:scale-95"
            >
              チャット占いで相談する
            </Link>
          )}
        </div>
        <p className="mt-2 text-[10px] text-muted/70" aria-label="広告表記">
          ※ 本リンクはアフィリエイト広告です
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="占い師相談のご案内"
      className="my-8 rounded-2xl border border-neon-red/40 bg-gradient-to-br from-surface to-surface/50 p-6 shadow-lg shadow-neon-red/10 sm:p-8"
    >
      <div className="text-center">
        <p className="mb-1 text-[10px] tracking-widest text-neon-red/80">── PROMOTION ──</p>
        <h3 className="font-mincho mb-3 text-base font-semibold leading-relaxed text-gold sm:text-lg">
          {copy.headline}
        </h3>
        <p className="mb-5 text-xs leading-relaxed text-muted sm:text-sm">{copy.sub}</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {phoneUrl && (
            <Link
              href={phoneUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-neon-red bg-neon-red/10 px-6 py-3 text-sm font-semibold text-neon-red transition-all hover:bg-neon-red/20 active:scale-95 sm:w-auto"
            >
              📞 電話占いを見てみる
            </Link>
          )}
          {chatUrl && (
            <Link
              href={chatUrl}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-gold bg-gold/10 px-6 py-3 text-sm font-semibold text-gold transition-all hover:bg-gold/20 active:scale-95 sm:w-auto"
            >
              💬 チャット占いを見てみる
            </Link>
          )}
        </div>
        <p className="mt-4 text-[10px] leading-relaxed text-muted/70" aria-label="広告表記">
          ※ 本リンクはアフィリエイト広告を含みます。ご利用による成果が当サイトの収益となる場合があります。
        </p>
      </div>
    </section>
  );
}

import Link from "next/link";
import AdBanner from "@/components/AdBanner";

export default function Home() {
  return (
    <div>
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-[#0a0408] px-4 py-24 text-center sm:py-32">
        {/* ビネット背景 */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0a0408_80%)]" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h1 className="font-mincho mb-6 text-3xl font-bold leading-tight tracking-wide sm:text-5xl">
            <span className="text-gold animate-gold-pulse">
              運命の扉を開きませんか
            </span>
          </h1>
          <p className="font-yuji mx-auto mb-10 max-w-xl text-base leading-relaxed text-warm sm:text-lg">
            ── 最先端のAIが、古来の占術を紡ぐ ──
          </p>
          <Link
            href="#fortune-menu"
            className="inline-block rounded-full border-2 border-neon-red bg-transparent px-8 py-3 text-sm font-semibold text-neon-red animate-neon-flicker transition-all hover:bg-neon-red/10"
          >
            占いを始める
          </Link>
        </div>
      </section>

      {/* 占いメニューカード */}
      <section
        id="fortune-menu"
        className="mx-auto max-w-6xl px-4 py-16 sm:py-24"
      >
        <h2 className="font-yuji mb-12 text-center text-2xl tracking-widest text-warm sm:text-3xl">
          ━━━━ 占いの館 ━━━━
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* タロットカード */}
          <Link href="/tarot" className="group">
            <div className="card-mystical card-glow-red flex h-full flex-col rounded-2xl border border-border bg-surface p-8">
              <div className="mb-4 text-5xl">&#x1F0CF;</div>
              <h3 className="mb-2 text-xl font-bold text-neon-red transition-colors group-hover:brightness-125">
                タロット占い
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                78枚のタロットカードからAIがあなたのために選び、過去・現在・未来を読み解きます。恋愛、仕事、人生の転機に。
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-neon-red/80 transition-colors group-hover:text-neon-red">
                <span>占ってみる</span>
                <span className="transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* 星座占いカード */}
          <Link href="/zodiac" className="group">
            <div className="card-mystical card-glow-gold flex h-full flex-col rounded-2xl border border-border bg-surface p-8">
              <div className="mb-4 text-5xl">&#x2B50;</div>
              <h3 className="mb-2 text-xl font-bold text-gold transition-colors group-hover:brightness-125">
                星座占い
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                あなたの星座から今日の運勢をAIが詳しく鑑定。総合運、恋愛運、仕事運、金運をお伝えします。
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-gold/80 transition-colors group-hover:text-gold">
                <span>占ってみる</span>
                <span className="transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* 相性占いカード */}
          <Link href="/compatibility" className="group">
            <div className="card-mystical card-glow-pink flex h-full flex-col rounded-2xl border border-border bg-surface p-8">
              <div className="mb-4 text-5xl">&#x1F491;</div>
              <h3 className="mb-2 text-xl font-bold text-neon-pink transition-colors group-hover:brightness-125">
                相性占い
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                気になるあの人との相性をAIが占います。二人の星座から恋愛・友情・仕事の相性を総合的に鑑定。
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-neon-pink/80 transition-colors group-hover:text-neon-pink">
                <span>占ってみる</span>
                <span className="transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* MBTI診断カード */}
          <Link href="/mbti" className="group">
            <div className="card-mystical card-glow-cyan flex h-full flex-col rounded-2xl border border-border bg-surface p-8">
              <div className="mb-4 text-5xl">&#x1F9E0;</div>
              <h3 className="mb-2 text-xl font-bold text-neon-cyan transition-colors group-hover:brightness-125">
                MBTI診断
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                16タイプの性格診断であなたを分析。AIがMBTIタイプに基づいた恋愛・仕事・人間関係のアドバイスをお届け。
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-neon-cyan/80 transition-colors group-hover:text-neon-cyan">
                <span>診断してみる</span>
                <span className="transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 広告スペース */}
      <AdBanner slot="top-1" format="horizontal" />

      {/* 特徴セクション */}
      <section className="border-t border-border bg-[#0a0408] px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-yuji mb-12 text-center text-2xl tracking-widest text-warm sm:text-3xl">
            ━━ 占処の特徴 ━━
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-2xl">
                &#x1F916;
              </div>
              <h3 className="mb-2 text-base font-semibold text-gold">高精度AI鑑定</h3>
              <p className="text-sm leading-relaxed text-muted">
                最新のAI技術を活用し、あなただけのパーソナルな鑑定結果をお届けします。
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-2xl">
                &#x23F0;
              </div>
              <h3 className="mb-2 text-base font-semibold text-gold">24時間いつでも</h3>
              <p className="text-sm leading-relaxed text-muted">
                AIだから深夜でも早朝でも、いつでもあなたの相談に応じます。
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-2xl">
                &#x1F512;
              </div>
              <h3 className="mb-2 text-base font-semibold text-gold">完全プライベート</h3>
              <p className="text-sm leading-relaxed text-muted">
                あなたの相談内容は他の誰にも見られません。安心してご利用ください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 下部広告スペース */}
      <AdBanner slot="top-2" format="horizontal" />
    </div>
  );
}

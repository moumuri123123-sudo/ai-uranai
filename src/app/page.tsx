import Link from "next/link";
import Image from "next/image";
import AdBanner from "@/components/AdBanner";
import FortuneIcon from "@/components/FortuneIcon";
import DailyFortune from "@/components/DailyFortune";
import { websiteJsonLd } from "@/lib/jsonld";
import { blogArticles } from "@/lib/blog-data";

export default function Home() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-[#0a0408] px-4 py-20 text-center sm:py-28">
        {/* 背景画像 */}
        <Image
          src="/images/hero-bg.webp"
          alt="占処 AI占いの館のイメージ"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
          priority
        />
        {/* ビネット背景 */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0a0408_80%)]" />

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* ネオン看板風サイト名 */}
          <div className="mb-2">
            <span className="font-yuji text-sm tracking-[0.5em] text-neon-red/60 uppercase sm:text-base">
              ── fortune telling ──
            </span>
          </div>

          <h1 className="font-mincho mb-4 leading-none">
            <span className="hero-neon-sign block text-[5rem] font-extrabold tracking-[0.15em] text-neon-red sm:text-[8rem]">
              占処
            </span>
          </h1>

          {/* サブタイトル */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50 sm:w-20" />
            <p className="font-yuji text-lg tracking-[0.3em] text-gold sm:text-xl">
              AI占い師
            </p>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50 sm:w-20" />
          </div>

          {/* 占い種類タグ */}
          <p className="mb-10 text-xs tracking-[0.2em] text-muted sm:text-sm">
            タロット ・ 星座 ・ 相性 ・ MBTI&reg; ・ 夢占い ・ 数秘術
          </p>

          {/* 主要CTA */}
          <div className="flex flex-col items-center">
            <Link
              href="#fortune-menu"
              aria-label="占いを始める（占いメニューへ）"
              className="hero-cta-button inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-neon-red bg-neon-red/10 px-10 text-base font-bold tracking-wider text-neon-red shadow-[0_0_32px_rgba(255,45,85,0.35)] transition-all hover:bg-neon-red/20 hover:shadow-[0_0_48px_rgba(255,45,85,0.6)] motion-safe:animate-pulse"
            >
              占いを始める
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 今日の運勢 */}
      <DailyFortune />

      {/* 今日の運勢ランキング */}
      <section className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/daily-ranking" className="group block">
          <div className="rounded-2xl border border-gold/30 bg-surface p-6 text-center transition-all hover:border-gold/60 hover:bg-surface-hover hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]">
            <p className="mb-1 text-xs tracking-widest text-muted">
              毎朝7時更新
            </p>
            <h2 className="font-mincho mb-2 text-xl font-bold tracking-wider text-gold sm:text-2xl">
              今日の運勢ランキング
            </h2>
            <p className="mb-3 text-sm text-muted">
              12星座の今日の運勢をランキングで発表。あなたの星座は何位？
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-gold/80 transition-colors group-hover:text-gold">
              ランキングを見る
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </span>
          </div>
        </Link>
      </section>

      {/* 広告スペース（ランキング導線と占いメニューの間） */}
      <AdBanner slot="top-0" format="horizontal" />

      {/* 占いメニューカード */}
      <section
        id="fortune-menu"
        className="mx-auto max-w-6xl px-4 py-16 sm:py-24"
      >
        <h2 className="font-yuji mb-12 text-center text-2xl tracking-widest text-warm sm:text-3xl">
          ━━━━ 占いの館 ━━━━
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* タロットカード（人気・おすすめ。枠をやや太くして強調） */}
          <Link href="/tarot" className="group touch-manipulation">
            <div className="card-mystical card-glow-red relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-neon-red/40 bg-surface ring-1 ring-neon-red/10">
              <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full bg-gold/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#0a0408] shadow-[0_0_12px_rgba(255,215,0,0.35)]">
                人気
              </span>
              <div className="relative h-36 w-full">
                <Image src="/images/tarot.webp" alt="タロット占い" fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover opacity-70 transition-opacity group-hover:opacity-90" />
              </div>
              <div className="flex flex-1 flex-col p-6 pt-4">
              <div className="mb-3"><FortuneIcon type="tarot" size="lg" /></div>
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
            </div>
          </Link>

          {/* 星座占いカード */}
          <Link href="/zodiac" className="group touch-manipulation">
            <div className="card-mystical card-glow-gold flex h-full flex-col rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="relative h-36 w-full">
                <Image src="/images/zodiac.webp" alt="星座占い" fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover opacity-70 transition-opacity group-hover:opacity-90" />
              </div>
              <div className="flex flex-1 flex-col p-6 pt-4">
              <div className="mb-3"><FortuneIcon type="zodiac" size="lg" /></div>
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
            </div>
          </Link>

          {/* 相性占いカード */}
          <Link href="/compatibility" className="group touch-manipulation">
            <div className="card-mystical card-glow-pink flex h-full flex-col rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="relative h-36 w-full">
                <Image src="/images/compatibility.webp" alt="相性占い" fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover opacity-70 transition-opacity group-hover:opacity-90" />
              </div>
              <div className="flex flex-1 flex-col p-6 pt-4">
              <div className="mb-3"><FortuneIcon type="compatibility" size="lg" /></div>
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
            </div>
          </Link>

          {/* MBTI診断カード */}
          <Link href="/mbti" className="group touch-manipulation">
            <div className="card-mystical card-glow-cyan flex h-full flex-col rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="relative h-36 w-full">
                <Image src="/images/mbti.webp" alt="MBTI診断" fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover opacity-70 transition-opacity group-hover:opacity-90" />
              </div>
              <div className="flex flex-1 flex-col p-6 pt-4">
              <div className="mb-3"><FortuneIcon type="mbti" size="lg" /></div>
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
            </div>
          </Link>

          {/* 夢占いカード（NEW：比較的新しく追加されたメニュー） */}
          <Link href="/dream" className="group touch-manipulation">
            <div className="card-mystical card-glow-purple relative flex h-full flex-col rounded-2xl border border-border bg-surface overflow-hidden">
              <span className="absolute top-3 left-3 z-10 inline-flex items-center rounded-full border border-neon-purple/60 bg-[#0a0408]/80 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-neon-purple">
                NEW
              </span>
              <div className="relative h-36 w-full">
                <Image src="/images/dream.webp" alt="夢占い" fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover opacity-70 transition-opacity group-hover:opacity-90" />
              </div>
              <div className="flex flex-1 flex-col p-6 pt-4">
              <div className="mb-3"><FortuneIcon type="dream" size="lg" /></div>
              <h3 className="mb-2 text-xl font-bold text-neon-purple transition-colors group-hover:brightness-125">
                夢占い
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                あなたが見た夢に隠されたメッセージをAIが読み解きます。深層心理と運命のヒントを探りましょう。
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-neon-purple/80 transition-colors group-hover:text-neon-purple">
                <span>占ってみる</span>
                <span className="transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
              </div>
            </div>
          </Link>

          {/* 数秘術カード */}
          <Link href="/numerology" className="group touch-manipulation">
            <div className="card-mystical card-glow-amber flex h-full flex-col rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="relative h-36 w-full">
                <Image src="/images/numerology.webp" alt="数秘術" fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover opacity-70 transition-opacity group-hover:opacity-90" />
              </div>
              <div className="flex flex-1 flex-col p-6 pt-4">
              <div className="mb-3"><FortuneIcon type="numerology" size="lg" /></div>
              <h3 className="mb-2 text-xl font-bold text-neon-amber transition-colors group-hover:brightness-125">
                数秘術
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                生年月日からライフパスナンバーを算出。AIがあなたの性格・使命・運命を数字で鑑定します。
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-neon-amber/80 transition-colors group-hover:text-neon-amber">
                <span>鑑定してみる</span>
                <span className="transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 広告スペース */}
      <AdBanner slot="top-1" format="horizontal" />

      {/* 新着コラム */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <h2 className="font-yuji mb-12 text-center text-2xl tracking-widest text-warm sm:text-3xl">
          ━━ 新着コラム ━━
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {[...blogArticles]
            .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
            .slice(0, 3)
            .map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group"
              >
                <div className="card-mystical flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
                  <div className="relative aspect-video w-full overflow-hidden bg-[#0a0408]">
                    <Image
                      src={`/images/blog/${article.slug}.webp`}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 pt-4">
                    <div className="mb-3">
                      {article.category !== "general" ? (
                        <FortuneIcon type={article.category} size="md" />
                      ) : (
                        <FortuneIcon type="ai" size="md" />
                      )}
                    </div>
                    <h3 className="mb-2 text-base font-bold text-foreground transition-colors group-hover:text-gold line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm text-muted line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">
                        {article.publishedAt}
                      </span>
                      <span className="text-sm text-gold/70 group-hover:text-gold">
                        読む &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-block rounded-full border-2 border-gold/50 bg-transparent px-6 py-2 text-sm text-gold/80 transition-all hover:border-gold hover:text-gold hover:bg-gold/5"
          >
            コラム一覧を見る &rarr;
          </Link>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="border-t border-border bg-[#0a0408] px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-yuji mb-12 text-center text-2xl tracking-widest text-warm sm:text-3xl">
            ━━ 占処の特徴 ━━
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <FortuneIcon type="ai" size="md" className="mb-4" />
              <h3 className="mb-2 text-base font-semibold text-gold">AIが個別に鑑定</h3>
              <p className="text-sm leading-relaxed text-muted">
                最新のAI技術を活用し、あなただけのパーソナルな鑑定結果をお届けします。
              </p>
            </div>
            <div className="text-center">
              <FortuneIcon type="clock" size="md" className="mb-4" />
              <h3 className="mb-2 text-base font-semibold text-gold">24時間いつでも</h3>
              <p className="text-sm leading-relaxed text-muted">
                AIだから深夜でも早朝でも、いつでもあなたの相談に応じます。
              </p>
            </div>
            <div className="text-center">
              <FortuneIcon type="lock" size="md" className="mb-4" />
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

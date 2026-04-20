import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "占処について",
  description:
    "占処（うらないどころ）は、Gemini 2.5 Flashを用いた無料のAI占いサイトです。運営者情報・占える占術・更新方針・免責事項・お問い合わせについてご案内します。",
  alternates: {
    canonical: "https://uranaidokoro.com/about",
  },
};

type FortuneCard = {
  href: string;
  title: string;
  description: string;
  accent: string; // Tailwind ring / border accent
};

const fortuneCards: FortuneCard[] = [
  {
    href: "/tarot",
    title: "タロット占い",
    description: "大アルカナ22枚を使って、今の問いに光を当てます。",
    accent: "hover:border-neon-red/60 hover:shadow-[0_0_24px_rgba(255,45,85,0.18)]",
  },
  {
    href: "/zodiac",
    title: "星座占い",
    description: "12星座それぞれの性質から、今日の運気を読み解きます。",
    accent: "hover:border-gold/60 hover:shadow-[0_0_24px_rgba(255,215,0,0.18)]",
  },
  {
    href: "/mbti",
    title: "MBTI\u00ae診断",
    description: "16タイプの傾向をもとに、思考のクセを言葉にします。",
    accent: "hover:border-neon-cyan/60 hover:shadow-[0_0_24px_rgba(0,221,255,0.18)]",
  },
  {
    href: "/compatibility",
    title: "相性占い",
    description: "ふたりの関係を、やわらかな視点でそっと照らします。",
    accent: "hover:border-neon-pink/60 hover:shadow-[0_0_24px_rgba(255,105,180,0.18)]",
  },
  {
    href: "/numerology",
    title: "数秘術",
    description: "生年月日が示す数字から、生まれ持った質を辿ります。",
    accent: "hover:border-neon-purple/60 hover:shadow-[0_0_24px_rgba(136,72,152,0.18)]",
  },
  {
    href: "/dream",
    title: "夢占い",
    description: "夢に現れた断片を、象徴の辞書でひも解きます。",
    accent: "hover:border-neon-amber/60 hover:shadow-[0_0_24px_rgba(240,160,48,0.18)]",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#0a0408] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-mincho mb-10 text-center text-2xl font-bold text-gold sm:text-3xl">
          占処について
        </h1>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
          {/* 占処とは */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              占処とは
            </h2>
            <p>
              「占処（うらないどころ）」は、GoogleのAIモデル
              <span className="text-warm">{" Gemini 2.5 Flash "}</span>
              を用いて、6つの占術を無料でお届けするAI占いサイトです。
              レトロな占い館のような雰囲気のなかで、気の向いたときに扉を叩いていただけるよう設えました。
            </p>
            <p className="mt-3">
              登録も課金も不要です。問いをひとつ抱えて、ふらりと暖簾をくぐるようにお楽しみください。
            </p>
          </section>

          {/* 占える占術 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              占える占術
            </h2>
            <p className="mb-5">
              気分や問いの種類に合わせて、下記の6つの占術からお選びいただけます。
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {fortuneCards.map((card) => (
                <li key={card.href}>
                  <Link
                    href={card.href}
                    className={`block h-full rounded-lg border border-border bg-[#0a0408]/60 p-4 transition-all ${card.accent}`}
                  >
                    <p className="font-mincho text-base text-gold">{card.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-foreground/75">
                      {card.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted">
              ※ MBTI&reg;（Myers-Briggs Type Indicator）は The Myers-Briggs Company の登録商標です。
              当サイトの診断は同社公認のものではありません。
            </p>
          </section>

          {/* 運営者について */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              運営者について
            </h2>
            <p>
              占処は、AIと占いの両方を愛するひとりの運営者が、個人で運営している小さなサイトです。
              「占いの敷居をもう少し低くしたい」「夜中にも気兼ねなく話せる相手がいるといい」
              ──そんな思いから始まりました。
            </p>
            <p className="mt-3">
              技術的な試みとしての面も大切にしており、
              AIがどこまで自然に占いの語り口を真似られるのかを日々探っています。
              商用の占い鑑定のような重さはなく、気の向いたときにお茶を淹れるくらいの軽やかさで
              立ち寄っていただける場所でありたいと考えています。
            </p>
            <dl className="mt-5 space-y-2 text-xs">
              <div className="flex gap-4">
                <dt className="w-24 shrink-0 text-muted">運営者</dt>
                <dd className="text-foreground/90">廣末 大輝</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-24 shrink-0 text-muted">運営形態</dt>
                <dd className="text-foreground/90">個人運営</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-24 shrink-0 text-muted">運営開始</dt>
                <dd className="text-foreground/90">2026年</dd>
              </div>
            </dl>
          </section>

          {/* 更新について */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              更新について
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                毎朝7時（日本時間）に、デイリー運勢のランキングを自動更新します。
                その日の流れを、朝のひとときにご覧ください。
              </li>
              <li>
                占いにまつわる読み物やコラムを、月に数本のペースで少しずつ追加しています。
                急がずに、書ける日に書ける分だけ、という緩やかな更新です。
              </li>
              <li>
                システム面はAIモデルの動向に合わせて随時見直します。大きな変更がある際は、
                ページ上または<Link href="/blog" className="text-warm underline underline-offset-4 hover:text-gold">コラム</Link>でお知らせいたします。
              </li>
            </ul>
          </section>

          {/* 免責事項 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              免責事項
            </h2>
            <p>
              占処が提供する占い結果は、AIが生成するエンターテインメントコンテンツです。
              生まれた言葉のひとつひとつは、あくまで思考のきっかけとしてお受け取りください。
              医療・法律・金銭・生命に関わる重要な判断については、
              占い結果を根拠とせず、各分野の専門家へのご相談をおすすめします。
            </p>
            <p className="mt-3">
              詳しい利用条件や個人情報の取扱いは、
              <Link href="/terms" className="text-warm underline underline-offset-4 hover:text-gold">利用規約</Link>
              および
              <Link href="/privacy" className="text-warm underline underline-offset-4 hover:text-gold">プライバシーポリシー</Link>
              をご確認ください。
            </p>
          </section>

          {/* お問い合わせ */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              お問い合わせ
            </h2>
            <p>
              ご意見・ご感想、掲載内容に関するご指摘などございましたら、
              下記のメールアドレスまでお気軽にご連絡ください。いただいたお便りはひとつずつ目を通しています。
            </p>
            <p className="mt-4">
              <a
                href="mailto:oyasumi6964@gmail.com"
                className="font-mincho text-base text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                oyasumi6964@gmail.com
              </a>
            </p>
          </section>

          {/* フッタ内リンク */}
          <div className="border-t border-border pt-6 text-center">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link
                href="/legal/tokushoho"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                特定商取引法に基づく表記
              </Link>
              <Link
                href="/privacy"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                プライバシーポリシー
              </Link>
              <Link
                href="/terms"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                利用規約
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

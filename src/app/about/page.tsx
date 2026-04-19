import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "占処 AI占いの運営者情報・サイト概要です。AI技術を活用した占いエンターテインメントサービスについてご紹介します。",
  alternates: {
    canonical: "https://uranaidokoro.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#0a0408] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-mincho mb-10 text-center text-2xl font-bold text-gold sm:text-3xl">
          このサイトについて
        </h1>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              占処とは
            </h2>
            <p>
              「占処（うらないどころ）」は、最先端のAI技術と古来の占術を融合させた、
              新しい形の占いエンターテインメントサービスです。
            </p>
            <p className="mt-3">
              レトロな占い館をコンセプトに、タロット占い・星座占い・相性占い・MBTI&reg;診断・夢占い・数秘術の
              6つの占術をすべて無料でお楽しみいただけます。
            </p>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              占処の理念
            </h2>
            <p>
              占処は、占いを「堅苦しい儀式」ではなく「気軽に楽しめるエンターテインメント」として提供することを大切にしています。
              暮らしの中でふと立ち止まりたくなったとき、心のモヤモヤを整理したくなったときに、
              お茶を飲むような軽やかさで扉を叩いていただける場所でありたいと考えています。
            </p>
            <p className="mt-3">
              人生の決断を下すのは、いつだってあなた自身です。占いの結果はあくまで思考のきっかけや背中を押す小さな風であり、
              答えそのものではありません。占処は、24時間いつでもそばにいる静かな話し相手として、
              あなたの心の整理をそっとお手伝いする存在でありたいと願っています。
            </p>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              占処の特徴
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <span className="font-semibold text-foreground">AI占い師との対話</span>
                ── チャット形式で、まるで本物の占い師と対話するような体験ができます。
              </li>
              <li>
                <span className="font-semibold text-foreground">6つの占術</span>
                ── タロット、星座、相性、MBTI、夢占い、数秘術を網羅。気分やお悩みに合わせてお選びいただけます。
              </li>
              <li>
                <span className="font-semibold text-foreground">完全無料</span>
                ── すべての占い機能を無料でご利用いただけます。会員登録も不要です。
              </li>
              <li>
                <span className="font-semibold text-foreground">プライバシー配慮</span>
                ── 占い結果は当サイトのサーバーやデータベースには保存されず、お使いの端末にのみ記録されます。なお、AI回答の生成にあたっては、ご入力内容がGoogle LLC（Gemini API）に送信されます。詳しくは<Link href="/privacy" className="text-warm underline underline-offset-4 hover:text-gold">プライバシーポリシー</Link>をご確認ください。
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              こんな方におすすめ
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                誰にも話しづらい悩みを、気軽に相談してみたい方
              </li>
              <li>
                深夜や早朝など、思い立ったそのときに占いを試してみたい方
              </li>
              <li>
                対面の占い館に行くのは少しハードルが高いと感じている方
              </li>
              <li>
                頭の中のモヤモヤを言葉にして、自分の気持ちを整理したい方
              </li>
              <li>
                占いを日常のちょっとしたエンターテインメントとして楽しみたい方
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              AI占い師の仕組み
            </h2>
            <p>
              占処のAI占い師は、Google社が提供する大規模言語モデル「Gemini」を利用して回答を生成しています。
              Geminiは膨大な書籍・ウェブ上のテキストから学習しており、そこには古今東西の占術に関する知識も多く含まれています。
            </p>
            <p className="mt-3">
              タロットの大アルカナ22枚が持つ象徴的な意味、12星座それぞれの性格的特徴、
              数秘術における各数字の意味合いなど、占術の伝統的な解釈をベースに据えつつ、
              あなたが入力した質問や状況に合わせて、AIがその場で文章を組み立ててお届けします。
            </p>
            <p className="mt-3">
              もちろん、長年の経験を積んだ対面占い師の「直感」や「場の空気を読む力」までは再現できません。
              その代わり、AI占い師は24時間いつでも待機していて、気軽に何度でも相談できるという気軽さが最大の強みです。
              結果に過度に依存することなく、ひとつの視点・ひとつの参考として、ゆったりとお楽しみください。
            </p>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              ご利用にあたっての注意
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                占処が提供する占い結果はAIが生成したエンターテインメントコンテンツであり、
                科学的根拠や統計的な裏付けがあるものではありません。
              </li>
              <li>
                医療・法律・金銭・生命に関わる重大なご判断については、占いの結果を根拠とせず、
                必ず医師・弁護士・ファイナンシャルプランナーなど各分野の専門家にご相談ください。
              </li>
              <li>
                占いの結果に過度に依存することはおすすめしません。
                あくまでひとつの見方・ひとつの参考としてお受け取りいただき、最終的な判断はご自身で行ってください。
              </li>
              <li>
                ユーザーがチャットに入力した質問内容は、回答生成のためGoogle社のGemini APIへ送信されます。
                氏名・住所・電話番号・パスワードなどの個人情報や機密情報は入力されないようご注意ください。
              </li>
              <li>
                占い結果はお使いの端末のローカルストレージにのみ保存され、占処のサーバーや外部データベースには送信・保管されません。
                ブラウザのデータを削除すると履歴も消去されます。
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              運営者情報
            </h2>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-28 shrink-0 text-muted">サイト名</span>
                <span className="text-foreground">占処 AI占い</span>
              </div>
              <div className="flex">
                <span className="w-28 shrink-0 text-muted">運営者</span>
                <span className="text-foreground">占処運営事務局</span>
              </div>
              <div className="flex">
                <span className="w-28 shrink-0 text-muted">URL</span>
                <a href="https://uranaidokoro.com" className="text-warm underline underline-offset-4 transition-colors hover:text-gold">
                  https://uranaidokoro.com
                </a>
              </div>
              <div className="flex">
                <span className="w-28 shrink-0 text-muted">運営形態</span>
                <span className="text-foreground">個人運営</span>
              </div>
              <div className="flex">
                <span className="w-28 shrink-0 text-muted">お問い合わせ</span>
                <a href="mailto:oyasumi6964@gmail.com" className="text-warm underline underline-offset-4 transition-colors hover:text-gold">
                  oyasumi6964@gmail.com
                </a>
              </div>
              <div className="flex">
                <span className="w-28 shrink-0 text-muted">運営開始</span>
                <span className="text-foreground">2026年3月</span>
              </div>
            </div>
          </section>

          <div className="border-t border-border pt-6 text-center">
            <div className="flex justify-center gap-6">
              <Link
                href="/contact"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                お問い合わせ
              </Link>
              <Link
                href="/terms"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                利用規約
              </Link>
              <Link
                href="/privacy"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

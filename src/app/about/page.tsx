import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "このサイトについて - 占処 AI占い",
  description: "占処 AI占いの運営者情報・サイト概要です。AI技術を活用した占いエンターテインメントサービスについてご紹介します。",
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
              レトロな占い館をコンセプトに、タロット占い・星座占い・相性占い・MBTI診断・夢占い・数秘術の
              6つの占術をすべて無料でお楽しみいただけます。
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
                ── 占い結果はお使いの端末にのみ保存され、サーバーには送信されません。
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              AI技術について
            </h2>
            <p>
              占処では、Google Gemini APIを利用してAI占い師の回答を生成しています。
              各占術の伝統的な解釈をベースに、AIがあなただけのパーソナルな鑑定をリアルタイムでお届けします。
            </p>
            <p className="mt-3">
              なお、AI占い師の回答はエンターテインメントとしてお楽しみいただくものです。
              医療・法律・金融などの重要な判断には、必ず各分野の専門家にご相談ください。
            </p>
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
                <span className="w-28 shrink-0 text-muted">URL</span>
                <a href="https://uranaidokoro.com" className="text-warm underline underline-offset-4 transition-colors hover:text-gold">
                  https://uranaidokoro.com
                </a>
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

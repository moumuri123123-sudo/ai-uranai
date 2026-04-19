import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "占処 AI占いへのお問い合わせはこちら。ご質問・ご意見・不具合のご報告などお気軽にご連絡ください。",
  alternates: {
    canonical: "https://uranaidokoro.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#0a0408] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-mincho mb-10 text-center text-2xl font-bold text-gold sm:text-3xl">
          お問い合わせ
        </h1>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
          <section className="rounded-xl border border-border bg-surface p-6 text-center">
            <p>
              「占処 AI占い」に関するご質問・ご意見・不具合のご報告など、
              お気軽にお問い合わせください。
            </p>
            <p className="mt-3">
              以下のメールアドレスまでご連絡いただければ、
              内容を確認のうえ、必要に応じてご返信いたします。
            </p>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6 text-center">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              連絡先
            </h2>
            <p className="text-base text-foreground">
              メール：
              <a
                href="mailto:oyasumi6964@gmail.com"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                oyasumi6964@gmail.com
              </a>
            </p>
            <p className="mt-4 text-xs text-muted">
              ※ 返信までにお時間をいただく場合がございます。<br />
              ※ すべてのお問い合わせに返信をお約束するものではありません。
            </p>
          </section>

          <section className="rounded-xl border border-border bg-surface p-6 text-center">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              お問い合わせの前に
            </h2>
            <ul className="space-y-3 text-left mx-auto max-w-lg list-disc pl-5">
              <li>
                占い結果の内容に関するご質問は、AIによる自動生成のため個別の回答が難しい場合がございます。
              </li>
              <li>
                サイトの不具合やエラーをご報告いただく際は、ご利用のブラウザ・端末の情報を添えていただけると助かります。
              </li>
              <li>
                広告掲載やビジネスに関するお問い合わせもこちらのメールアドレスで受け付けております。
              </li>
            </ul>
          </section>

          <div className="border-t border-border pt-6 text-center">
            <p className="mt-4">
              <Link
                href="/"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                トップに戻る
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description:
    '占処 AI占いへのお問い合わせはこちら。ご質問・ご意見・不具合のご報告などお気軽にご連絡ください。',
  alternates: {
    canonical: 'https://uranaidokoro.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#0a0408] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-mincho text-gold mb-10 text-center text-2xl font-bold sm:text-3xl">
          お問い合わせ
        </h1>

        <div className="text-foreground/80 space-y-8 text-sm leading-relaxed">
          <section className="border-border bg-surface rounded-xl border p-6 text-center">
            <p>
              「占処 AI占い」に関するご質問・ご意見・不具合のご報告など、
              お気軽にお問い合わせください。
            </p>
            <p className="mt-3">
              以下のメールアドレスまでご連絡いただければ、
              内容を確認のうえ、必要に応じてご返信いたします。
            </p>
          </section>

          <section className="border-border bg-surface rounded-xl border p-6 text-center">
            <h2 className="font-mincho text-gold mb-4 text-lg font-semibold">連絡先</h2>
            <p className="text-foreground text-base">
              メール：
              <a
                href="mailto:oyasumi6964@gmail.com"
                className="text-warm hover:text-gold underline underline-offset-4 transition-colors"
              >
                oyasumi6964@gmail.com
              </a>
            </p>
            <p className="text-muted mt-4 text-xs">
              ※ 返信までにお時間をいただく場合がございます。
              <br />※ すべてのお問い合わせに返信をお約束するものではありません。
            </p>
          </section>

          <section className="border-border bg-surface rounded-xl border p-6 text-center">
            <h2 className="font-mincho text-gold mb-4 text-lg font-semibold">お問い合わせの前に</h2>
            <ul className="mx-auto max-w-lg list-disc space-y-3 pl-5 text-left">
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

          <div className="border-border border-t pt-6 text-center">
            <p className="mt-4">
              <Link
                href="/"
                className="text-warm hover:text-gold underline underline-offset-4 transition-colors"
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

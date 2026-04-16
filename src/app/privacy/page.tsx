import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "占処 AI占いのプライバシーポリシーです。収集する情報、利用目的、第三者提供等についてご確認ください。",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#0a0408] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-mincho mb-10 text-center text-2xl font-bold text-gold sm:text-3xl">
          プライバシーポリシー
        </h1>

        <div className="space-y-10 text-sm leading-relaxed text-foreground/80">
          {/* 前文 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <p>
              「占処 AI占い」（以下「本サービス」）は、ユーザーのプライバシーを尊重し、
              個人情報の保護に努めます。本プライバシーポリシーは、本サービスにおける情報の取扱いについて定めるものです。
            </p>
          </section>

          {/* 1. 個人情報の定義 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              1. 個人情報の定義
            </h2>
            <p>
              本ポリシーにおける「個人情報」とは、個人情報保護法に定める個人情報を指し、
              特定の個人を識別できる情報（氏名、メールアドレス、IPアドレス等）をいいます。
            </p>
          </section>

          {/* 2. 収集する情報 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              2. 収集する情報
            </h2>
            <p className="mb-3">本サービスでは、以下の情報を取得する場合があります。</p>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                <span className="font-semibold text-foreground">占い利用時のチャット内容:</span>{" "}
                ユーザーが入力した質問や選択内容。これらの情報はサーバーに保存されず、
                占い結果の生成にのみ使用されます。
              </li>
              <li>
                <span className="font-semibold text-foreground">アクセスログ:</span>{" "}
                IPアドレス、ブラウザの種類、アクセス日時、参照元URL等のサーバーログ情報。
              </li>
              <li>
                <span className="font-semibold text-foreground">アクセス解析情報:</span>{" "}
                本サービスでは、サービスの品質向上を目的として、Google Analytics等の
                アクセス解析ツールを使用する場合があります。これらのツールはCookieを利用して、
                匿名の統計データを収集します。
              </li>
            </ul>
          </section>

          {/* 3. 利用目的 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              3. 利用目的
            </h2>
            <p className="mb-3">収集した情報は、以下の目的で利用します。</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>占い結果の生成およびサービスの提供</li>
              <li>サービスの品質向上・改善</li>
              <li>不正利用の検知・防止</li>
              <li>サービスの利用状況の分析</li>
            </ul>
          </section>

          {/* 4. 第三者提供 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              4. 第三者への提供
            </h2>
            <p>
              運営者は、原則としてユーザーの個人情報を第三者に提供しません。
              ただし、以下の場合を除きます。
            </p>
            <ul className="mt-3 list-disc space-y-3 pl-5">
              <li>
                <span className="font-semibold text-foreground">AI占い結果の生成:</span>{" "}
                本サービスは占い結果の生成にGoogle Gemini APIを使用しています。
                ユーザーが入力したチャット内容は、AI による回答生成のため Google LLC のサーバーに送信されます。
                Google のデータ取扱いについては、
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-warm underline underline-offset-4 transition-colors hover:text-gold">Google プライバシーポリシー</a>
                および
                <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" className="text-warm underline underline-offset-4 transition-colors hover:text-gold">Gemini API 利用規約</a>
                をご参照ください。
                センシティブな個人情報の入力はお控えください。
              </li>
              <li>法令に基づく開示が求められた場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合</li>
            </ul>
          </section>

          {/* 5. Cookieの使用 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              5. Cookieの使用
            </h2>
            <p className="mb-3">
              本サービスでは、以下の目的でCookieを使用する場合があります。
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-semibold text-foreground">必須Cookie:</span>{" "}
                サイトの正常な動作に必要なCookie
              </li>
              <li>
                <span className="font-semibold text-foreground">分析Cookie:</span>{" "}
                Google Analytics等によるアクセス解析のためのCookie
              </li>
              <li>
                <span className="font-semibold text-foreground">広告Cookie:</span>{" "}
                Google AdSenseによるパーソナライズ広告の配信のためのCookie
              </li>
            </ul>

            <h3 className="font-mincho mt-5 mb-3 text-base font-semibold text-foreground">
              Google AdSenseについて
            </h3>
            <p className="mb-3">
              本サービスでは、第三者配信の広告サービス「Google
              AdSense」を利用しています。Google等の第三者広告配信事業者は、Cookieを使用してユーザーのウェブサイトへの過去のアクセス情報に基づいて広告を配信します。
            </p>
            <p className="mb-3">
              Googleによる広告Cookieの使用により、ユーザーが当サイトや他のサイトにアクセスした際の情報に基づき、適切な広告が表示されることがあります。
            </p>
            <p className="mb-3">
              ユーザーは{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline hover:text-neon-red"
              >
                Google広告設定ページ
              </a>
              にて、パーソナライズ広告を無効にすることができます。また、
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline hover:text-neon-red"
              >
                aboutads.info
              </a>
              にて、第三者配信事業者のCookieを無効にすることも可能です。
            </p>

            <h3 className="font-mincho mt-5 mb-3 text-base font-semibold text-foreground">
              Google Analyticsについて
            </h3>
            <p className="mb-3">
              本サービスでは、アクセス解析のためにGoogle
              Analyticsを利用しています。Google
              Analyticsはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
            </p>
            <p className="mb-3">
              詳しくは{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline hover:text-neon-red"
              >
                Googleのプライバシーポリシー
              </a>
              をご覧ください。
            </p>

            <p className="mt-3">
              ユーザーはブラウザの設定からCookieを無効にすることが可能です。
              ただし、一部の機能が正常に動作しなくなる場合があります。
            </p>
          </section>

          {/* 6. データの保管期間 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              6. データの保管期間
            </h2>
            <p>
              ユーザーが占い利用時に入力したチャット内容は、サーバーに保存されません。
              セッション終了時（ページを閉じた時点）に破棄されます。
            </p>
            <p className="mt-3">
              アクセスログは、サービスの運用上必要な期間に限り保管し、
              不要になった時点で適切に削除します。
            </p>
          </section>

          {/* 7. ユーザーの権利 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              7. ユーザーの権利
            </h2>
            <p>
              ユーザーは、運営者に対して以下の請求を行うことができます。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>保有する個人情報の開示</li>
              <li>個人情報の訂正・追加・削除</li>
              <li>個人情報の利用停止</li>
            </ul>
            <p className="mt-3">
              上記の請求を行う場合は、下記のお問い合わせ先までご連絡ください。
              ご本人確認のうえ、合理的な期間内に対応いたします。
            </p>
          </section>

          {/* 8. お問い合わせ先 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              8. お問い合わせ先
            </h2>
            <p>
              本ポリシーに関するお問い合わせは、下記までご連絡ください。
            </p>
            <p className="mt-3 font-semibold text-foreground">
              メール:{" "}
              <a
                href="mailto:oyasumi6964@gmail.com"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                oyasumi6964@gmail.com
              </a>
            </p>
          </section>

          {/* 9. ポリシーの変更 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              9. ポリシーの変更
            </h2>
            <p>
              運営者は、必要に応じて本ポリシーを変更する場合があります。
              変更があった場合は、本ページ上で通知いたします。
              変更後のポリシーは、本ページに掲載した時点で効力を生じます。
            </p>
          </section>

          {/* フッター情報 */}
          <div className="border-t border-border pt-6 text-center">
            <p className="text-muted">最終更新日: 2026年3月18日</p>
            <p className="mt-4">
              <Link
                href="/terms"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                利用規約はこちら
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

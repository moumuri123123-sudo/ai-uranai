import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "利用規約",
  description: "占処 AI占いの利用規約です。サービスの利用条件、免責事項、禁止事項等をご確認ください。",
  alternates: {
    canonical: "https://uranaidokoro.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="bg-[#0a0408] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-mincho mb-10 text-center text-2xl font-bold text-gold sm:text-3xl">
          利用規約
        </h1>

        <div className="space-y-10 text-sm leading-relaxed text-foreground/80">
          {/* 第1条 サービスの概要 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              第1条（サービスの概要）
            </h2>
            <p>
              「占処 AI占い」（以下「本サービス」）は、AI技術（Google Gemini API）を利用した占いエンターテインメントサービスです。
              タロット占い、星座占い、相性占い、MBTI&reg;診断、夢占い、数秘術等のコンテンツを提供します。
            </p>
            <p className="mt-3">
              本サービスが提供する占い結果は、あくまでエンターテインメント（娯楽）としてお楽しみいただくものであり、
              科学的根拠に基づく助言や予測ではありません。
              医療診断・法的判断・金銭判断・人生の重大な判断の根拠として使用しないでください。
            </p>
            <p className="mt-3 text-xs text-muted">
              ※ MBTI&reg;（Myers-Briggs Type Indicator）はThe Myers-Briggs Companyの登録商標です。本サービスで提供するMBTI関連コンテンツは、同社公認のものではありません。
            </p>
          </section>

          {/* 第2条 利用条件 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              第2条（利用条件）
            </h2>
            <p>
              本サービスは、下記の利用資格を満たす方であれば、どなたでも無料でご利用いただけます。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <span className="font-semibold text-foreground">13歳未満の方は、本サービスを利用することができません。</span>
              </li>
              <li>
                13歳以上の未成年者が本サービスを利用する場合は、保護者（親権者または法定代理人）の同意を得たうえでご利用ください。
              </li>
            </ul>
            <p className="mt-3">
              本サービスを利用された時点で、本規約に同意したものとみなします。
              本規約に同意いただけない場合は、本サービスのご利用をお控えください。
            </p>
          </section>

          {/* 第3条 免責事項 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              第3条（免責事項）
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              <li>
                占い結果はAIによる自動生成であり、エンターテインメント目的で提供されます。
                結果の正確性、信頼性、完全性について一切保証いたしません。
              </li>
              <li>
                医療、法律、金融、人間関係等に関する重要な判断は、必ず各分野の専門家にご相談ください。
                本サービスの占い結果を専門的な助言の代替として使用しないでください。
              </li>
              <li>
                AIの回答に基づくユーザーの判断や行動について、法律上有効な限りにおいて、運営者は責任を負いません。
                ただし、運営者の故意または重大な過失により生じた損害については、この限りではありません。
              </li>
              <li>
                システム障害、通信障害、その他やむを得ない事由により本サービスが利用できなかった場合、
                法律上有効な限りにおいて、運営者は責任を負いません。
              </li>
            </ul>
          </section>

          {/* 第4条 禁止事項 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              第4条（禁止事項）
            </h2>
            <p className="mb-3">本サービスの利用にあたり、以下の行為を禁止します。</p>
            <ul className="list-disc space-y-3 pl-5">
              <li>本サービスのシステムに対する不正アクセスまたは不正アクセスの試み</li>
              <li>自動化ツール・bot等による過度な連続アクセスやサーバーに負荷をかける行為</li>
              <li>本サービスのコンテンツや占い結果を無断で商用目的に転載・複製する行為</li>
              <li>他者への嫌がらせ、誹謗中傷、脅迫等の目的で占い結果を利用する行為</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ul>
          </section>

          {/* 第5条 知的財産権 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              第5条（知的財産権）
            </h2>
            <p>
              本サービスに掲載されているテキスト、画像、デザイン、プログラム、
              その他のコンテンツに関する著作権およびその他の知的財産権は、運営者に帰属します。
            </p>
            <p className="mt-3">
              ユーザーは、個人の非営利目的に限り占い結果を利用できます。
              運営者の事前の書面による承諾なく、商用利用、複製、転載、改変等を行うことはできません。
            </p>
          </section>

          {/* 第6条 個人情報の取扱い */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              第6条（個人情報の取扱い）
            </h2>
            <p>
              本サービスにおける個人情報の取扱いについては、
              <Link href="/privacy" className="text-warm underline underline-offset-4 transition-colors hover:text-gold">
                プライバシーポリシー
              </Link>
              をご確認ください。
            </p>
          </section>

          {/* 第7条 サービスの変更・終了 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              第7条（サービスの変更・終了）
            </h2>
            <p>
              運営者は、事前の通知なく本サービスの内容を変更し、または本サービスの提供を一時中断もしくは終了する場合があります。
              これによりユーザーに生じた損害について、消費者契約法その他法律上有効な限りにおいて、運営者は一切の責任を負いません。
              ただし、運営者の故意または重大な過失により生じた損害については、この限りではありません。
            </p>
          </section>

          {/* 第8条 規約の変更 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              第8条（規約の変更）
            </h2>
            <p>
              運営者は、必要と判断した場合に本規約を変更できるものとします。
              変更後の規約は、本ページに掲載した時点で効力を生じます。
              本サービスの利用を継続された場合、変更後の規約に同意したものとみなします。
            </p>
          </section>

          {/* 第9条 準拠法・管轄 */}
          <section className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-mincho mb-4 text-lg font-semibold text-gold">
              第9条（準拠法・管轄裁判所）
            </h2>
            <p>
              本規約の解釈および適用は日本法に準拠します。
              本サービスに関する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          {/* フッター情報 */}
          <div className="border-t border-border pt-6 text-center">
            <p className="text-muted">最終更新日: 2026年3月18日</p>
            <p className="mt-4">
              <Link
                href="/privacy"
                className="text-warm underline underline-offset-4 transition-colors hover:text-gold"
              >
                プライバシーポリシーはこちら
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function ZodiacGuide() {
  return (
    <article className="mt-16 border-t border-border pt-12">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-foreground/85">

        <header className="text-center">
          <h2 className="font-mincho mb-3 text-2xl font-bold text-gold sm:text-3xl">
            星座占いを知る
          </h2>
          <p className="text-xs text-muted">
            占処の星座占いをより深く楽しむための基礎知識と使い方
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-gold">
            星座占いとは
          </h3>
          <p>
            星座占い（西洋占星術）は、生まれた瞬間の天体の配置をもとに、
            その人の性格や運勢、人生の流れを読み解く占術です。
            起源は古代バビロニアにさかのぼり、ギリシャ・ローマ時代に体系化され、
            ヨーロッパを中心に2000年以上の歴史を持つ伝統的な知恵として今も世界中で親しまれています。
          </p>
          <p className="mt-3">
            一般的に「◯◯座」と呼ばれるのは、生まれた日に太陽が位置していた星座を指す「太陽星座」のこと。
            太陽星座はその人の本質や自己表現の傾向を示すとされ、
            自分自身を理解する入口として最もわかりやすい要素です。
            占処の星座占いでは、AIが伝統的な占星術の解釈をベースに、
            あなたの星座に合わせた個別のメッセージをお届けします。
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-gold">
            12星座の基本性格
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-neon-red">牡羊座・牡牛座・双子座・蟹座</h4>
              <p>
                牡羊座（3/21〜4/19）は行動力と情熱にあふれる開拓者。
                牡牛座（4/20〜5/20）は安定と美を愛するマイペースな実力者。
                双子座（5/21〜6/21）は好奇心旺盛で機転のきく情報通。
                蟹座（6/22〜7/22）は家族思いで共感力の高い優しい人。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-neon-red">獅子座・乙女座・天秤座・蠍座</h4>
              <p>
                獅子座（7/23〜8/22）は堂々とした存在感を放つ天性のリーダー。
                乙女座（8/23〜9/22）は几帳面で分析力に優れた努力家。
                天秤座（9/23〜10/23）は調和を重んじる社交的なバランサー。
                蠍座（10/24〜11/22）は一途で情熱的、深い洞察力を持つ探究者。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-neon-red">射手座・山羊座・水瓶座・魚座</h4>
              <p>
                射手座（11/23〜12/21）は自由と冒険を愛する楽天的な旅人。
                山羊座（12/22〜1/19）は忍耐強く目標を達成する堅実な努力家。
                水瓶座（1/20〜2/18）は独創的で博愛精神にあふれた革新者。
                魚座（2/19〜3/20）は感受性が豊かで想像力に満ちた夢想家。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-gold">
            4つのエレメント（火・地・風・水）
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-neon-red">火のエレメント（牡羊座・獅子座・射手座）</h4>
              <p>
                情熱・行動力・直感を象徴するエネルギーあふれるグループ。
                物事をゼロから生み出す創造性や、困難に立ち向かうパワーが持ち味です。
                周囲を明るく照らすリーダー気質で、新しい挑戦を恐れません。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-neon-red">地のエレメント（牡牛座・乙女座・山羊座）</h4>
              <p>
                現実感覚・忍耐・安定を司る大地のようなグループ。
                コツコツと努力を積み重ね、物事を形にしていく力に長けています。
                五感を大切にし、お金や身体など目に見えるものを重視する傾向があります。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-neon-red">風のエレメント（双子座・天秤座・水瓶座）</h4>
              <p>
                知性・コミュニケーション・客観性を象徴する軽やかなグループ。
                言葉や情報を扱うのが得意で、人と人とをつなぐ役割を担います。
                物事を論理的に捉え、柔軟な発想で新しい視点をもたらします。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-neon-red">水のエレメント（蟹座・蠍座・魚座）</h4>
              <p>
                感情・共感・直感を司る繊細で深いグループ。
                他者の気持ちを敏感に察知し、相手に寄り添う優しさを持っています。
                想像力や芸術的感性に恵まれ、目に見えない世界とのつながりを感じやすい性質です。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-gold">
            星座占いを活かすコツ
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold text-neon-red">毎朝の運勢を行動の指針にする</span>
              ── その日のラッキーカラーや吉方位を服装や予定に取り入れると、
              前向きな気持ちでスタートを切りやすくなります。
            </li>
            <li>
              <span className="font-semibold text-neon-red">太陽星座以外も調べてみる</span>
              ── 月星座や金星星座など、他の天体の配置を知ると
              自分の多面的な性格や恋愛傾向がより立体的に見えてきます。
            </li>
            <li>
              <span className="font-semibold text-neon-red">苦手な相手の星座を理解する</span>
              ── 相性の悪さも星座ごとの性質を知れば納得できることが多く、
              無理のない距離感で付き合うヒントになります。
            </li>
            <li>
              <span className="font-semibold text-neon-red">結果に縛られすぎない</span>
              ── 星座占いはあくまで傾向を示すもの。
              「当たっている部分だけ参考にする」くらいの気持ちで付き合うのが、
              日常を豊かにする賢い使い方です。
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-gold">
            よくある質問（FAQ）
          </h3>
          <div className="space-y-3">
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 誕生日が星座の境目の場合、どちらの星座になりますか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 星座の切り替わりは年によって1日ほど前後することがあります。
                境目（カスプ）にあたる日に生まれた方は、出生時刻と出生地をもとに
                正確なホロスコープを作成することで、どちらの星座に属するかがはっきりします。
                両方の星座の性質を併せ持つ人も多く、どちらの特徴にも共感できる場合があります。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 西洋占星術と東洋占星術は何が違うのでしょうか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 西洋占星術は12星座（黄道十二宮）と10個の天体をもとに、
                誕生時点の空の配置から個人の性格や運勢を読み解きます。
                一方、東洋占星術（四柱推命や宿曜占星術など）は陰陽五行説や
                月の動きを重視するのが特徴です。
                占処の星座占いは西洋占星術の体系に基づいています。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 毎日の運勢はどう活用すればよいですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 毎日の運勢はその日のエネルギーの傾向を示すものです。
                「今日は慎重に動くとよい日」と出たら大きな決断を避ける、
                「対人運が好調」と出たら積極的に連絡を取るなど、
                日々の行動を少し意識するだけで過ごし方の質が変わります。
                ただし結果に振り回されず、参考程度に取り入れるのがおすすめです。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 太陽星座と月星座の違いは何ですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 太陽星座は生まれた日に太陽があった星座で、
                表面的な性格や人生で目指す方向性を表します。
                月星座は月があった星座で、本能的な感情やプライベートでの素の自分を示します。
                「普段の自分と星座占いが違う気がする」と感じる方は、
                月星座を調べると納得できる部分が多いかもしれません。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 星座占いに科学的な根拠はありますか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 星座占いは統計的・科学的に証明されたものではなく、
                長い歴史の中で培われた象徴体系・文化的な知恵です。
                ただ、自分を客観的に見つめるきっかけや、
                他者の性格を理解するヒントとしては十分に役立ちます。
                結果を絶対視せず、自分らしく生きるための参考として楽しんでください。
              </p>
            </details>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-gold">
            関連する占い
          </h3>
          <ul className="flex flex-wrap gap-3">
            <li>
              <Link
                href="/compatibility"
                className="inline-block rounded-lg border border-border bg-[#0a0408]/50 px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-gold hover:text-gold"
              >
                相性占い
              </Link>
            </li>
            <li>
              <Link
                href="/numerology"
                className="inline-block rounded-lg border border-border bg-[#0a0408]/50 px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-gold hover:text-gold"
              >
                数秘術
              </Link>
            </li>
          </ul>
        </section>

        <div className="text-center text-xs text-muted">
          <p>
            さらに深く学びたい方は、
            <Link href="/blog" className="mx-1 text-gold underline underline-offset-4 hover:text-neon-red">
              コラム記事
            </Link>
            もご覧ください。12星座それぞれの詳しい性格や相性を解説した記事などを掲載しています。
          </p>
        </div>

      </div>
    </article>
  );
}

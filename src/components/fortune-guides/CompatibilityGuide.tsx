import Link from "next/link";

export default function CompatibilityGuide() {
  return (
    <article className="mt-16 border-t border-border pt-12">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-foreground/85">

        <header className="text-center">
          <h2 className="font-mincho mb-3 text-2xl font-bold text-neon-pink sm:text-3xl">
            相性占いを知る
          </h2>
          <p className="text-xs text-muted">
            占処の相性占いをより深く楽しむための基礎知識と関係別の見方
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-pink">
            相性占いとは
          </h3>
          <p>
            相性占いは、自分と相手との関係性や、二人の間に流れる空気感を読み解く占術の総称です。
            恋人・友人・同僚・家族など、あらゆる人間関係において、
            お互いがどのように影響し合うのか、どんな特性がかみ合いやすいのかを見つめる手がかりになります。
            古来より、人と人との縁は占いの重要なテーマとされてきました。
          </p>
          <p className="mt-3">
            相性を見る方法には、西洋占星術の星座、生年月日を用いた数秘術、東洋の九星気学、
            近年広まったMBTIなど、実にさまざまなアプローチがあります。
            それぞれに切り口は異なりますが、いずれも「違いを知り、活かす」ための道具です。
            占処の相性占いでは、二人の星座をベースにAIが総合的に鑑定し、
            関係性の特徴や向き合い方のヒントをわかりやすくお伝えします。
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-pink">
            星座による相性の基本
          </h3>
          <p>
            西洋占星術では、12星座を「火・地・風・水」の4つのエレメントに分類します。
            同じエレメント同士は感覚や価値観が似ており、自然体でいられる関係になりやすいのが特徴です。
            一方で、ホロスコープ上で180度離れた対極の星座は、正反対だからこそ補い合える関係とされます。
          </p>
          <p className="mt-3">
            また、90度の角度を持つ星座同士は刺激的で成長を促すぶつかり合いを、
            120度離れた星座同士は調和的で安定した関係を築きやすいと言われます。
            相性の良し悪しはシンプルな優劣ではなく、エネルギーの流れ方の違いとして捉えるのが大切です。
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-pink">
            関係別・相性の見方
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-gold">恋愛の相性</h4>
              <p>
                恋愛では、価値観の一致だけでなく、感情表現の仕方や距離感のとり方が重要になります。
                情熱的にぶつかり合うのが心地よい二人もいれば、
                静かな安心感を求め合う二人もいます。相手の愛情表現を受け取れているか、
                そして自分らしく愛せているかを確かめる視点で読むのがおすすめです。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">友情の相性</h4>
              <p>
                友情においては、一緒にいて疲れないかどうか、
                お互いの違いを楽しめるかどうかが鍵になります。
                趣味や関心が重なる友人も、正反対の世界を見せてくれる友人も、
                どちらも人生を豊かにする大切な縁。長く続く関係のヒントを読み解きましょう。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">仕事の相性</h4>
              <p>
                仕事の相性では、コミュニケーションのスタイル、意思決定のスピード、
                役割分担のバランスを見ていきます。気が合わなくても補完関係が築ければ成果は上がるもの。
                相手の得意を尊重し、自分の強みを重ねていけるかが大切です。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-pink">
            相性が悪いと言われたときの考え方
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold text-gold">違いを理解の入り口にする</span>
              ──「合わない」とされる部分は、裏を返せばお互いに持っていない魅力でもあります。
              相手の世界を知るきっかけとして捉え直してみましょう。
            </li>
            <li>
              <span className="font-semibold text-gold">努力で歩み寄れる余地を探す</span>
              ── 占いの結果は固定された運命ではなく現在の傾向。
              小さな気遣いの積み重ねで、関係は必ず変化していきます。
            </li>
            <li>
              <span className="font-semibold text-gold">距離感を調整する</span>
              ── すべての人と深く関わる必要はありません。
              心地よい距離を見つけることも、相性を活かす立派な方法です。
            </li>
            <li>
              <span className="font-semibold text-gold">自分自身の状態を振り返る</span>
              ── 同じ相手でも、自分の心の余裕次第で関係は大きく変わります。
              まずは自分を整えることが、相性を良くする第一歩になることも多いです。
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-pink">
            よくある質問（FAQ）
          </h3>
          <div className="space-y-3">
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 相性が悪いと絶対にうまくいかないのでしょうか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. いいえ、そんなことはありません。相性占いはあくまで傾向を示すもので、
                実際の関係はお互いの思いやりやコミュニケーションで大きく変わります。
                「合わないから気をつけよう」と意識するだけでも関係性は前向きに動き出します。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 同じ星座同士の相性はいいのですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 同じ星座同士は価値観が似ており、一緒にいて楽という良さがあります。
                一方で、似すぎていて刺激が少なかったり、同じ弱点を抱え込みやすかったりする面も。
                心地よさと成長、どちらを大切にしたいかで受け取り方は変わります。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 家族や上司との相性も占えますか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. はい、相性占いは恋愛に限らず、どんな人間関係にも応用できます。
                家族や上司のように選べない関係こそ、相手の特性を知っておくことが役立ちます。
                違いを理解して接し方を工夫するヒントとしてご活用ください。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 血液型の相性は扱っていますか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 占処の相性占いは星座をベースにしており、血液型は使用していません。
                血液型による性格分類は文化として親しまれていますが、
                当サイトでは占星術的な切り口を大切にしています。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 相性占いの結果を気になる相手に伝えてもいいですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 楽しい話題として共有するのは素敵ですが、結果を押しつけるのは避けましょう。
                「こう出たから仲良くしてほしい」ではなく、会話のきっかけやお互いを知る材料として使うのがおすすめ。
                相性占いは関係を深める入り口であって、ゴールではありません。
              </p>
            </details>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-pink">
            関連する占い
          </h3>
          <ul className="flex flex-wrap gap-3">
            <li>
              <Link
                href="/zodiac"
                className="inline-block rounded-lg border border-border bg-[#0a0408]/50 px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-neon-pink hover:text-neon-pink"
              >
                星座占い
              </Link>
            </li>
            <li>
              <Link
                href="/mbti"
                className="inline-block rounded-lg border border-border bg-[#0a0408]/50 px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-neon-pink hover:text-neon-pink"
              >
                MBTI診断
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
            もご覧ください。星座ごとの性格や関係の築き方を詳しく解説した記事を掲載しています。
          </p>
        </div>

      </div>
    </article>
  );
}

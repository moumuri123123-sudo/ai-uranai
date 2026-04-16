import Link from "next/link";

export default function TarotGuide() {
  return (
    <article className="mt-16 border-t border-border pt-12">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-foreground/85">

        <header className="text-center">
          <h2 className="font-mincho mb-3 text-2xl font-bold text-neon-red sm:text-3xl">
            タロット占いを知る
          </h2>
          <p className="text-xs text-muted">
            占処のタロット占いをより深く楽しむための基礎知識と使い方
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-red">
            タロット占いとは
          </h3>
          <p>
            タロット占いは、78枚のカード（大アルカナ22枚・小アルカナ56枚）を使って、
            質問者の過去・現在・未来や、心の奥底にある想い、取るべき行動のヒントを読み解く
            伝統的な占術です。起源は15世紀ごろのイタリアとされ、当初はカードゲームとして広まりましたが、
            18世紀以降ヨーロッパの神秘主義者たちによって占いの道具として体系化されていきました。
          </p>
          <p className="mt-3">
            タロットの最大の特徴は「偶然の中に必然を見る」という考え方です。
            シャッフルされたカードから無作為に引かれた1枚には、
            今のあなたに必要なメッセージが込められていると解釈します。
            占処のタロット占いでは、AIが伝統的なカード解釈をベースに、
            あなたの状況に合わせた読み解きをお届けします。
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-red">
            大アルカナと小アルカナの違い
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-gold">大アルカナ（22枚）</h4>
              <p>
                0番「愚者」から21番「世界」まで、人生の重要なテーマや大きな流れを象徴するカードです。
                愛・死・運命・変化など、普遍的な概念を扱っており、
                占い結果の中心的なメッセージを伝える役割を担います。
                初心者の方は、まず大アルカナだけの意味を覚えることから始めるのがおすすめです。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">小アルカナ（56枚）</h4>
              <p>
                ワンド（棍棒）・カップ（聖杯）・ソード（剣）・ペンタクル（金貨）の4つのスートに分かれ、
                それぞれ14枚ずつで構成されます。日常の出来事や身近な人間関係、
                細かなアドバイスを示すカードで、大アルカナのメッセージをより具体的に補完します。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-red">
            正位置と逆位置の読み方
          </h3>
          <p>
            タロットカードには「正位置」と「逆位置」があり、同じカードでも向きによって意味が変化します。
            一般的に正位置はカードの持つポジティブな側面を、逆位置はその裏側や注意点を示すと解釈されます。
          </p>
          <p className="mt-3">
            ただし、逆位置が必ずしも「悪い」というわけではありません。
            たとえば「死神」の逆位置は「変化への抵抗」を示すことがあり、
            「悪魔」の逆位置は「束縛からの解放」というポジティブな意味になります。
            カードの意味は質問や前後の文脈によって柔軟に読み解くことが大切です。
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-red">
            ワンオラクルとスリーカードの使い分け
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-gold">ワンオラクル（1枚引き）</h4>
              <p>
                質問に対して1枚のカードを引き、シンプルに答えを得る方法です。
                「今日はどんな1日になる？」「この選択肢で大丈夫？」といった
                直感的で端的な答えがほしいときに最適。
                初心者の方や、毎日の運勢チェックにも向いています。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">スリーカード（3枚引き）</h4>
              <p>
                過去・現在・未来の3枚を引き、時間の流れや状況の推移を読み解く展開法です。
                恋愛の行方、仕事の転機、人間関係の変化など、
                物語のように流れを追って理解したいテーマに適しています。
                ワンオラクルより深い洞察が得られる反面、解釈には少し慣れが必要です。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-red">
            よい占いをするためのコツ
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold text-gold">質問を具体的にする</span>
              ──「恋愛運は？」より「気になる相手に連絡してもいい？」のように、
              行動レベルで絞った質問のほうが的確なメッセージを得られます。
            </li>
            <li>
              <span className="font-semibold text-gold">結果を鵜呑みにしない</span>
              ── タロットは未来を決定するものではなく、
              今のエネルギーを映す鏡のようなもの。最終的に決めるのはあなた自身です。
            </li>
            <li>
              <span className="font-semibold text-gold">同じ質問を繰り返さない</span>
              ── 同じ質問を短時間で何度も占うと、カードの答えが散漫になりがちです。
              最低でも数日は間を空けるのがおすすめ。
            </li>
            <li>
              <span className="font-semibold text-gold">落ち着いた気持ちで臨む</span>
              ── 焦りや不安が強すぎると読み取りが偏りがち。深呼吸をして、
              静かな気持ちでカードに向き合いましょう。
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-red">
            よくある質問（FAQ）
          </h3>
          <div className="space-y-3">
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 毎日タロット占いをしてもいいですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 「今日はどう過ごすか」のようなデイリーな問いなら毎日でも問題ありません。
                ただし、同じ悩みを何度も占うのは避けたほうがよいでしょう。
                カードが同じ答えを出しにくくなり、かえって迷いが深まることがあります。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 逆位置が出たら悪いことが起こるのでしょうか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. いいえ、必ずしもそうではありません。逆位置は「別の視点」「注意点」「裏側の意味」を示すもので、
                カードによってはむしろ解放や転換を意味することもあります。
                出たカード全体の流れと質問内容を踏まえて読み解くことが大切です。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. AIによるタロット占いは本物の占い師と違いますか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 占処のAI占いは、伝統的なカード解釈と大量の占いテキストを学習したAIが回答を生成します。
                対面の占い師のような直感的な読みとは違いますが、
                24時間いつでも相談できること、気軽に複数の質問を投げられることが強みです。
                本格的な鑑定は対面やオンラインの占い師を利用し、
                日常の気持ちの整理にはAI占いを、というように使い分けるのもおすすめです。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 結果が気に入らないときはどうすればいい？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. タロットの結果は「避けられない未来」ではなく、現時点での流れや気をつけるべきポイントを示すものです。
                気に入らない結果が出たときは、そこから何を学び、どう行動を変えるかが大切。
                カードはあなたの味方であり、警告してくれる存在だと考えてみてください。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. タロットの結果は科学的に根拠がありますか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. タロット占いはエンターテインメントであり、科学的な予測手段ではありません。
                ただ、カードと向き合うことで自分の考えが整理されたり、気づきを得られることは多くあります。
                結果に振り回されず、自分自身の心を見つめるきっかけとして活用してください。
              </p>
            </details>
          </div>
        </section>

        <div className="text-center text-xs text-muted">
          <p>
            さらに深く学びたい方は、
            <Link href="/blog" className="mx-1 text-gold underline underline-offset-4 hover:text-neon-red">
              コラム記事
            </Link>
            もご覧ください。大アルカナ22枚の意味を1枚ずつ解説した記事などを掲載しています。
          </p>
        </div>

      </div>
    </article>
  );
}

import Link from "next/link";

export default function MbtiGuide() {
  return (
    <article className="mt-16 border-t border-border pt-12">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-foreground/85">

        <header className="text-center">
          <h2 className="font-mincho mb-3 text-2xl font-bold text-neon-cyan sm:text-3xl">
            MBTI®診断を知る
          </h2>
          <p className="text-xs text-muted">
            占処のタイプ診断をより深く楽しむための基礎知識と使い方
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-cyan">
            MBTI®とは
          </h3>
          <p>
            MBTI®（Myers-Briggs Type Indicator）は、スイスの心理学者C.G.ユングが提唱した
            タイプ論を土台に、キャサリン・クック・ブリッグスと娘のイザベル・ブリッグス・マイヤーズが
            体系化した性格理解のための枠組みです。人間の心の働き方を4つの指標で捉え、
            その組み合わせから16のタイプへと整理し、自分自身や他者の傾向を知る手がかりを提供します。
          </p>
          <p className="mt-3">
            なお「MBTI®」はThe Myers &amp; Briggs Foundationの登録商標であり、
            正式な診断は認定ファシリテーターによる有償セッションを通じて提供されています。
            占処で行う診断はユングのタイプ論に着想を得た簡易的な自己探索ツールであり、
            公式のMBTI®アセスメントではない点をあらかじめご了承ください。
            あくまで自分を見つめ直すきっかけとしてお楽しみいただけたら幸いです。
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-cyan">
            4つの指標
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-gold">E（外向） / I（内向）</h4>
              <p>
                心のエネルギーをどこへ向けるかを表す指標です。Eタイプは人や出来事など外の世界と関わることで活力を得て、
                話しながら考えを整理する傾向があります。一方Iタイプは内側の思考や想像の世界に意識が向きやすく、
                静かな時間を過ごすことで力を取り戻します。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">S（感覚） / N（直観）</h4>
              <p>
                情報をどう受け取るかを示す指標です。Sタイプは五感で得られる具体的な事実や現実的な情報を重視し、
                経験から積み上げて判断します。Nタイプは物事の背後にある可能性やパターン、
                ひらめきを大切にし、未来や全体像から考えるのが得意です。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">T（思考） / F（感情）</h4>
              <p>
                判断の軸をどこに置くかを表します。Tタイプは論理や一貫性を重視し、客観的な基準で物事を評価します。
                Fタイプは人の気持ちや価値観、調和を大切にし、関係性の中で納得できるかどうかを重視して
                意思決定を行います。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">J（判断） / P（知覚）</h4>
              <p>
                外の世界との関わり方を表す指標です。Jタイプは計画的で区切りをつけて進めるのが得意で、
                決めたスケジュールに沿って行動する安心感を好みます。Pタイプは柔軟で状況に応じて
                選択肢を広げたまま動くのを好み、臨機応変な対応力が持ち味です。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-cyan">
            16タイプの概要
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-gold">分析家（NT群）</h4>
              <p>
                INTJ・INTP・ENTJ・ENTPの4タイプ。論理的思考と構想力に長け、
                戦略や理論の構築を好みます。独立心が強く、効率や本質を追い求める傾向があり、
                新しい仕組みや未来像を描くことに情熱を注ぐ人が多いグループです。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">外交官（NF群）</h4>
              <p>
                INFJ・INFP・ENFJ・ENFPの4タイプ。理想や価値観を大切にし、人の可能性や感情に敏感です。
                共感力と表現力を兼ね備え、他者の成長を支えたり、
                創造的な活動を通して世界をよりよくしたいと願う人が多いグループです。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">番人（SJ群）</h4>
              <p>
                ISTJ・ISFJ・ESTJ・ESFJの4タイプ。責任感が強く、秩序や伝統、役割を重んじます。
                誠実に物事を積み上げ、周囲を支える働き方が得意で、
                組織やコミュニティを安定させる頼れる存在になることが多いグループです。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">探検家（SP群）</h4>
              <p>
                ISTP・ISFP・ESTP・ESFPの4タイプ。今この瞬間を楽しみ、五感と行動力に優れています。
                現場での適応力や器用さが持ち味で、職人気質な人もいれば、
                人生そのものを鮮やかに彩るエンターテイナー気質の人もいるグループです。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-cyan">
            MBTIを活かすコツ
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold text-gold">自己理解の手がかりにする</span>
              ── タイプの説明を読んで「自分はこういう場面で力が出る」と気づけたら、
              日々の選択や休み方を自分に合った形に整えるヒントになります。
            </li>
            <li>
              <span className="font-semibold text-gold">他者との違いを認める</span>
              ── 家族や同僚が自分と違うタイプでも、そこには優劣ではなく個性があります。
              「相手はこう感じやすいのかも」と想像できると、対話の摩擦が和らぎます。
            </li>
            <li>
              <span className="font-semibold text-gold">キャリアの方向性を考える</span>
              ── 得意な情報処理や判断スタイルを知ると、働き方や役割の選び方にも活かせます。
              ただし可能性を狭めず、参考のひとつとして受け止めましょう。
            </li>
            <li>
              <span className="font-semibold text-gold">人間関係の橋渡しに使う</span>
              ── 相手のタイプを決めつけるのではなく、自分と違う見方があると理解したうえで
              コミュニケーションを工夫する道具として役立てるのがおすすめです。
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-cyan">
            よくある質問（FAQ）
          </h3>
          <div className="space-y-3">
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 診断結果は何度やっても同じになりますか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. その時の気分や環境、質問の捉え方によって結果が変わることはよくあります。
                人は状況に応じて違う側面を見せるものなので、複数回の結果を見比べて、
                共通して表れる傾向を自分らしさの手がかりにすると安心です。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 相性の悪いタイプは本当にあるのでしょうか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. タイプ同士には「考え方の違いが大きい」組み合わせはありますが、
                それは必ずしも相性が悪いという意味ではありません。
                違いを理解し合えればむしろ補い合える関係になり得ます。相性診断はあくまで参考程度に楽しんでください。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 占処の診断は公式のMBTI®と同じものですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. いいえ、異なります。公式のMBTI®はThe Myers &amp; Briggs Foundationが提供する
                アセスメントで、認定ファシリテーターによるフィードバックを伴います。
                占処の診断はユングのタイプ論に着想を得た簡易的な自己探索ツールであり、
                気軽に自分を見つめる入り口としてご利用ください。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 診断されたタイプがどうも自分と違う気がします。
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 質問の解釈や一時的な状態で結果が揺れることはよくあります。
                似ていると感じるタイプの説明も読み比べて、自分にしっくりくるほうを参考にしてみてください。
                タイプはラベルではなく、自分を知るためのヒントです。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. MBTIには科学的な根拠があるのでしょうか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. MBTIはキャリア開発や自己理解の現場で広く活用されてきましたが、
                学術心理学の世界ではビッグファイブなど他の性格モデルと比べて妥当性に議論があるのも事実です。
                結果を絶対視せず、自分や他者を理解するきっかけのひとつとして柔らかく受け止めるのがおすすめです。
              </p>
            </details>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-cyan">
            関連する占い
          </h3>
          <ul className="flex flex-wrap gap-3">
            <li>
              <Link
                href="/compatibility"
                className="inline-block rounded-lg border border-border bg-[#0a0408]/50 px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-neon-cyan hover:text-neon-cyan"
              >
                相性占い
              </Link>
            </li>
            <li>
              <Link
                href="/tarot"
                className="inline-block rounded-lg border border-border bg-[#0a0408]/50 px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-neon-cyan hover:text-neon-cyan"
              >
                タロット占い
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
            もご覧ください。16タイプそれぞれの特徴を掘り下げた記事などを掲載しています。
          </p>
          <p className="mt-3">
            ※ MBTI®はThe Myers &amp; Briggs Foundationの登録商標です。
            当サイトの診断は公式MBTI®アセスメントではなく、ユングのタイプ論に着想を得た簡易的な自己探索ツールです。
          </p>
        </div>

      </div>
    </article>
  );
}

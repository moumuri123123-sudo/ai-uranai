import Link from "next/link";

export default function NumerologyGuide() {
  return (
    <article className="mt-16 border-t border-border pt-12">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-foreground/85">

        <header className="text-center">
          <h2 className="font-mincho mb-3 text-2xl font-bold text-neon-amber sm:text-3xl">
            数秘術を知る
          </h2>
          <p className="text-xs text-muted">
            占処の数秘術鑑定をより深く楽しむための基礎知識と活用法
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-amber">
            数秘術とは
          </h3>
          <p>
            数秘術（ヌメロロジー）は、紀元前6世紀ごろの古代ギリシャの数学者・哲学者ピタゴラスに
            起源をもつとされる、数の神秘を読み解く思想体系です。「万物は数である」という言葉に象徴されるように、
            ピタゴラスは宇宙の秩序や人間の運命も数字によって表現できると考えました。
          </p>
          <p className="mt-3">
            その後、ユダヤ教の神秘主義カバラの思想と結びつき、文字や名前、生年月日に宿る数字から
            魂の本質や人生の流れを読み解く技法として発展しました。
            現代の数秘術は、これら古代からの知恵に心理学的な解釈を加えた形で親しまれています。
            占処の数秘術鑑定では、生年月日をもとにAIがあなたの生まれもった性質や
            人生のテーマをわかりやすく読み解きます。
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-amber">
            ライフパスナンバーの計算方法
          </h3>
          <p>
            数秘術の中でもっとも基本となるのが「ライフパスナンバー」です。
            生年月日のすべての数字を1桁になるまで足し続けるだけで求められます。
          </p>
          <p className="mt-3">
            例えば1990年5月20日生まれの場合、
            <span className="font-semibold text-gold">1+9+9+0+5+2+0＝26</span>、
            さらに<span className="font-semibold text-gold">2+6＝8</span>となり、
            この方のライフパスナンバーは「8」になります。
          </p>
          <p className="mt-3">
            ただし、計算の途中で合計が11・22・33になった場合は、それ以上足さずにそのまま残します。
            これらは「マスターナンバー」と呼ばれる特別な数字として扱われます。
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-amber">
            数字が示す意味（1〜9）
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold text-gold">1：リーダー</span>
              ── 開拓者の数字。独立心が強く、先頭に立って道を切り開く性質を持ちます。
            </li>
            <li>
              <span className="font-semibold text-gold">2：協調</span>
              ── 調和とバランスの数字。人の気持ちに寄り添い、支え合うことで力を発揮します。
            </li>
            <li>
              <span className="font-semibold text-gold">3：創造</span>
              ── 表現と喜びの数字。明るく社交的で、創造性や遊び心に恵まれています。
            </li>
            <li>
              <span className="font-semibold text-gold">4：安定</span>
              ── 堅実と秩序の数字。地道な努力と誠実さで信頼を築く職人タイプです。
            </li>
            <li>
              <span className="font-semibold text-gold">5：自由</span>
              ── 変化と冒険の数字。好奇心旺盛で、新しい体験から学び成長します。
            </li>
            <li>
              <span className="font-semibold text-gold">6：愛</span>
              ── 家族と責任の数字。思いやり深く、身近な人を守り育てる役割を担います。
            </li>
            <li>
              <span className="font-semibold text-gold">7：探求</span>
              ── 知性と精神性の数字。物事の本質を見抜き、深く考えることを好みます。
            </li>
            <li>
              <span className="font-semibold text-gold">8：成功</span>
              ── 実現と豊かさの数字。現実的な力強さで目標を達成し、成果を形にします。
            </li>
            <li>
              <span className="font-semibold text-gold">9：完成</span>
              ── 博愛と完結の数字。広い視野と奉仕の心で、人や世界に貢献する使命を持ちます。
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-amber">
            マスターナンバー（11・22・33）
          </h3>
          <p>
            11・22・33は、通常の1〜9とは別格として扱われる特別な数字で、
            高いスピリチュアル性や大きな使命を示すとされています。
            そのぶん人生の課題やプレッシャーも大きくなる傾向があります。
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <h4 className="mb-1 font-semibold text-gold">11：直感と霊性</h4>
              <p>
                鋭い直感力とインスピレーションに恵まれ、人の心に気づきを与える役割を持ちます。
              </p>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-gold">22：実現力のある理想家</h4>
              <p>
                壮大なビジョンを現実に落とし込む力を備え、社会に大きな影響を与えうる数字です。
              </p>
            </div>
            <div>
              <h4 className="mb-1 font-semibold text-gold">33：無償の愛</h4>
              <p>
                深い愛と奉仕の心で、多くの人を包み込み癒す使命を持つとされる最高位の数字です。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-amber">
            数秘術を活かすコツ
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold text-gold">自分の強みを知る</span>
              ── ライフパスナンバーはあなたが生まれ持った才能や得意分野を示します。
              まずは自分の数字を受け入れ、強みとして活かす視点を持ちましょう。
            </li>
            <li>
              <span className="font-semibold text-gold">行動計画に活かす</span>
              ── 数字の性質を知ると、自分に合った働き方や学び方が見えてきます。
              無理なく力を発揮できる方向性を見つけるヒントになります。
            </li>
            <li>
              <span className="font-semibold text-gold">人との関係性を見る</span>
              ── 家族や同僚など身近な人の数字を知ることで、相手の価値観や
              コミュニケーションの癖を理解しやすくなります。
            </li>
            <li>
              <span className="font-semibold text-gold">数字に縛られすぎない</span>
              ── 数秘術はあくまで自分を知るための一つの道具。
              数字の意味にとらわれすぎず、日々の選択は自分の意思で決めましょう。
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-amber">
            よくある質問（FAQ）
          </h3>
          <div className="space-y-3">
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 名前からも数字を出せるのですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. はい、可能です。アルファベットの一文字ずつに数字を割り当てて合計する
                「ディスティニーナンバー（運命数）」という考え方があります。
                ライフパスナンバーが「生まれ持った性質」を示すのに対し、
                ディスティニーナンバーは「人生で果たす役割」を表すとされ、
                両方を合わせて読むとより立体的な自己理解につながります。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. ライフパスナンバーは年齢とともに変わりますか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. いいえ、ライフパスナンバーは生年月日から計算するため、一生変わりません。
                ただし、その年ごとに巡ってくる「パーソナルイヤーナンバー」は毎年変化し、
                その年のテーマや流れを示してくれます。
                変わらない軸と、移り変わるサイクルの両方を知ることで、
                今の自分に必要な過ごし方が見えやすくなります。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 相性を見る数字はありますか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 一般的には、お互いのライフパスナンバーを比較することで相性を読み解きます。
                1と5は自由を尊重し合える、2と6は思いやりが通じ合いやすい、など
                数字の性質同士の組み合わせから傾向を見ていきます。
                ただし相性は数字だけで決まるものではなく、関係を育てる努力も大切です。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 同じライフパスナンバー同士は相性がよいですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 価値観が似ているため理解し合いやすい反面、
                同じ弱点を共有しやすく、足りない部分を補い合うのが難しいこともあります。
                心地よさはありますが、刺激や成長を求めるなら別の数字との関わりも
                バランスよく持つのがおすすめです。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 東洋の九星気学とは何が違うのですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 九星気学は中国由来の暦と陰陽五行思想をベースにした東洋の占術で、
                生まれ年の九星から性質や方位の吉凶を読み解きます。
                一方、数秘術は西洋のピタゴラス思想とカバラをルーツとする占術で、
                生年月日の数字そのものから本質を読み取ります。
                同じ「数字を扱う占い」でも背景となる思想や見方が異なるため、
                両方を学ぶと多角的に自分を捉えられます。
              </p>
            </details>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-amber">
            関連する占い
          </h3>
          <ul className="flex flex-wrap gap-3">
            <li>
              <Link
                href="/zodiac"
                className="inline-block rounded-lg border border-border bg-[#0a0408]/50 px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-neon-amber hover:text-neon-amber"
              >
                星座占い
              </Link>
            </li>
            <li>
              <Link
                href="/dream"
                className="inline-block rounded-lg border border-border bg-[#0a0408]/50 px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-neon-amber hover:text-neon-amber"
              >
                夢占い
              </Link>
            </li>
          </ul>
        </section>

        <div className="text-center text-xs text-muted">
          <p>
            さらに深く学びたい方は、
            <Link href="/blog" className="mx-1 text-gold underline underline-offset-4 hover:text-neon-amber">
              コラム記事
            </Link>
            もご覧ください。数字ごとの詳しい解説や、パーソナルイヤーの活かし方などを掲載しています。
          </p>
        </div>

      </div>
    </article>
  );
}

import Link from "next/link";

export default function DreamGuide() {
  return (
    <article className="mt-16 border-t border-border pt-12">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-foreground/85">

        <header className="text-center">
          <h2 className="font-mincho mb-3 text-2xl font-bold text-neon-purple sm:text-3xl">
            夢占いを知る
          </h2>
          <p className="text-xs text-muted">
            占処の夢占いをより深く楽しむための基礎知識と読み解き方
          </p>
        </header>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-purple">
            夢占いとは
          </h3>
          <p>
            夢占いは、眠っている間に見る夢を深層心理からのメッセージとして読み解く占術です。
            古くは古代ギリシャやエジプトの時代から、夢は神託や未来を告げる徴として大切にされ、
            夢解きの専門家が王や神官に助言をしていたと伝えられています。
            近代に入るとフロイトが『夢判断』で無意識の願望の表れと捉え、
            ユングは個人を超えた普遍的象徴（元型）が夢に現れると論じました。
          </p>
          <p className="mt-3">
            占処のAI夢占いでは、こうした心理学的な夢分析と東西の夢解釈の知識をベースに、
            あなたが見た夢の情景や登場人物、感情を手がかりとして、
            今の心の状態や気づきのヒントを丁寧に読み解いてお届けします。
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-purple">
            夢の種類
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-gold">予知夢</h4>
              <p>
                近い未来に起きる出来事を暗示するとされる夢。
                はっきりとした映像や印象深い場面として記憶に残り、
                実際の出来事と符合することで後から気づかれるケースが多いとされます。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">警告夢</h4>
              <p>
                危険や注意すべき状況を知らせる夢。
                不安を感じる場面や身体の不調を連想させる描写として現れ、
                普段見落としがちな問題に目を向けるきっかけを与えてくれます。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">浄化夢</h4>
              <p>
                溜まった感情やストレスを夢の中で解放する夢。
                涙を流す・嵐の後に晴れるなど、感情の整理を促す展開が特徴で、
                見た後に心がすっきり軽くなる感覚が残りやすい夢です。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">願望夢</h4>
              <p>
                自分の叶えたい願いや抑えている欲求が形となって現れる夢。
                現実では言えないことを口にしたり、理想の状況を体験したりと、
                本音に気づくヒントを与えてくれる夢でもあります。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">ストレス夢</h4>
              <p>
                日常の疲れや緊張がそのまま反映される夢。
                追われる・遅刻するなど焦りを伴う展開が多く、
                心身の休息が必要だというサインとして受け取るのがおすすめです。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-purple">
            よく見る夢の象徴
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold text-gold">落ちる夢</h4>
              <p>
                支えを失う不安や自信の揺らぎを表すとされる夢。
                重要な決断の前や環境の変化のタイミングで見ることが多いと言われます。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">追われる夢</h4>
              <p>
                向き合いたくない課題や先送りしている問題の象徴。
                追ってくるものの正体は、あなた自身が直視を避けている感情であることも多いです。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">歯が抜ける夢</h4>
              <p>
                自信の喪失や環境の変化、健康面への意識を示す夢とされます。
                古来より転機を暗示する代表的な夢として語られてきました。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">空を飛ぶ夢</h4>
              <p>
                解放感や自由への憧れ、成長意欲を象徴するポジティブな夢。
                高く飛べるほど心のエネルギーが満ちている状態だと解釈されます。
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gold">水の夢</h4>
              <p>
                感情や無意識の状態を映す象徴。澄んだ水は心の安定、
                濁った水や荒れる水面は感情の乱れや未整理な想いを示すとされます。
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-purple">
            夢占いを楽しむコツ
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-semibold text-gold">枕元にメモを置く</span>
              ── 夢は目覚めて数分で急速に忘れてしまうもの。
              起きた瞬間に書き留められるよう、紙とペンやスマホを手の届く場所に置いておきましょう。
            </li>
            <li>
              <span className="font-semibold text-gold">夢日記をつける</span>
              ── 日付と一緒に夢の内容を記録していくと、自分がよく見るテーマや
              繰り返し現れるモチーフが見えてきます。心の変化を辿る手がかりにもなります。
            </li>
            <li>
              <span className="font-semibold text-gold">断片でも記録する</span>
              ── 全体のストーリーを思い出せなくても大丈夫。
              色・匂い・一言のセリフなど、印象に残った断片だけでも立派な手がかりになります。
            </li>
            <li>
              <span className="font-semibold text-gold">感情とセットで覚える</span>
              ── 夢の意味は、そこで自分がどう感じたかによって大きく変わります。
              「怖かった」「安心した」「懐かしかった」など、感情を添えて記録しておきましょう。
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-purple">
            よくある質問（FAQ）
          </h3>
          <div className="space-y-3">
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 夢を覚えていないときはどうすればいいですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 覚えていないこと自体に問題はありません。人は毎晩夢を見ていても、
                その多くは目覚めとともに忘れてしまうもの。
                起きてすぐ天井をぼんやり眺めながら思い出そうとする習慣をつけると、
                少しずつ断片を思い出せるようになっていきます。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 同じ夢を繰り返し見るのはなぜですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 繰り返し見る夢は、まだ心の中で解決していない問題や、
                向き合うべきテーマを知らせているサインと言われます。
                夢の登場人物や場面にどんな感情を抱いたかを言葉にしてみると、
                無意識が伝えようとしているメッセージに気づきやすくなります。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 悪夢ばかり見るのは不吉なサインですか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 悪夢は不吉の予兆ではなく、多くの場合ストレスや疲労、心の未消化な感情の表れです。
                むしろ心が「休みたい」「整理したい」とSOSを出している状態だと捉え、
                生活リズムや休息を見直すきっかけにするのがおすすめです。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 夢に出てきた人物は、相手の気持ちと関係がありますか？
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 夢に出てきた人物は、相手の本心そのものというより、
                あなたがその人に対して抱いている感情やイメージを映し出していると解釈されるのが一般的です。
                相手が登場したこと自体よりも、夢の中でどう接したか・どう感じたかに注目してみてください。
              </p>
            </details>
            <details className="group rounded-lg border border-border/60 bg-[#0a0408]/50 p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Q. 夜中に何度もうなされる・眠れないなど、体調への影響が気になります。
              </summary>
              <p className="mt-3 text-foreground/80">
                A. 繰り返しうなされる、睡眠が浅く日中の生活に支障が出るといった症状が続く場合は、
                夢占いではなく医療の領域です。無理に夢の意味を探ろうとせず、
                睡眠外来や心療内科など専門医への受診を検討してください。
              </p>
            </details>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-mincho mb-4 text-lg font-semibold text-neon-purple">
            関連する占い
          </h3>
          <ul className="flex flex-wrap gap-3">
            <li>
              <Link
                href="/tarot"
                className="inline-block rounded-lg border border-border bg-[#0a0408]/50 px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-neon-purple hover:text-neon-purple"
              >
                タロット占い
              </Link>
            </li>
            <li>
              <Link
                href="/numerology"
                className="inline-block rounded-lg border border-border bg-[#0a0408]/50 px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-neon-purple hover:text-neon-purple"
              >
                数秘術
              </Link>
            </li>
          </ul>
        </section>

        <div className="text-center text-xs text-muted">
          <p>
            さらに深く学びたい方は、
            <Link href="/blog" className="mx-1 text-gold underline underline-offset-4 hover:text-neon-purple">
              コラム記事
            </Link>
            もご覧ください。夢に現れる象徴の意味を掘り下げた記事などを掲載しています。
          </p>
        </div>

      </div>
    </article>
  );
}

import { GoogleGenAI } from "@google/genai";

export type TweetSlot = "midday" | "evening" | "night";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

// JSTでの日付取得
export function getJstDate(): Date {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

// 年始からの通算日数（JST）
export function getDayOfYearJst(): number {
  const jst = getJstDate();
  const start = Date.UTC(jst.getUTCFullYear(), 0, 0);
  const diff = jst.getTime() - start;
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}

export function getJstDateString(): string {
  const jst = getJstDate();
  return `${jst.getUTCFullYear()}-${String(jst.getUTCMonth() + 1).padStart(2, "0")}-${String(jst.getUTCDate()).padStart(2, "0")}`;
}

// 夢占いトレンド宣伝ツイート（4日に1回evening枠で差し替え）
export function getDreamTrendsTweet(): string {
  // URLに月クエリを付与することでXのOGPキャッシュを月次でバスト
  const jst = getJstDate();
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const monthQuery = `?m=${y}-${m}`;

  const patterns = [
    `🌙 今月みんなが見た夢は？

占処の「夢占いトレンド」で
匿名集計されたワード雲をチェック。
気になる夢を見た人が他にも…？

https://uranaidokoro.com/dream-trends${monthQuery}

#夢占い #占処`,
    `✨ 夢占いトレンド更新中

あなたが見た夢、実は今月流行ってるかも？
ワードをタップで即占い。

https://uranaidokoro.com/dream-trends${monthQuery}

#夢占い #AI占い`,
    `🌙 「最近こんな夢を見た」
を匿名で共有する占処の新機能。

今月よく見られている夢ランキング、
トップの夢が意外すぎるかも…🔮

https://uranaidokoro.com/dream-trends${monthQuery}

#占い #夢占い`,
  ];
  const idx = Math.floor(getDayOfYearJst() / 4) % patterns.length;
  return patterns[idx];
}

// evening枠で夢占いトレンド宣伝を出す日かどうか
export function shouldPromoteDreamTrends(): boolean {
  return getDayOfYearJst() % 4 === 0;
}

// Geminiでスロット別のオリジナルツイート生成
// slotとdateを組み合わせてシード的に使い、毎日違う内容を生成する
export async function generateTweetForSlot(slot: TweetSlot): Promise<string> {
  if (!ai) {
    return getFallbackTweet(slot);
  }

  const slotConfig: Record<
    TweetSlot,
    { theme: string; style: string; topics: string[] }
  > = {
    midday: {
      theme: "お昼に読むちょっとした占い豆知識",
      style: "物知りな友達が雑談ついでに教えてくれるトーン、会話的で温かい",
      topics: [
        "タロットカードの意外な由来や誤解されがちな意味",
        "数秘術で使う数字の面白い意味",
        "星座の元になったギリシャ神話のちょっとした話",
        "色や食べ物と運気の結びつきにまつわる昔からの言い伝え",
        "誕生石にまつわる豆知識",
      ],
    },
    evening: {
      theme: "夕方にゆるく読める占いの雑学",
      style: "一日の終わりに「へえ」と思える軽い語り口、知ってたら得な温度感",
      topics: [
        "夢占いで昔から語られてきたシンボルの本当の意味",
        "鏡が割れる・黒猫など身近な迷信のルーツ",
        "東洋占い（九星気学・四柱推命）のわかりやすい豆知識",
        "手相の有名な線にまつわる誤解と本当の見方",
        "タロットの大アルカナの意外なエピソード",
      ],
    },
    night: {
      theme: "寝る前にほっこりする占い小話",
      style: "落ち着いた深夜トーン、押し付けがましくない語りかけ、温度低めで温かい",
      topics: [
        "月の満ち欠けと昔からの習わしの話",
        "夢と占いの古くからの関係",
        "数秘術で見る「休む」意味を持つ数字の話",
        "古代文明が夜空の星で何を占っていたか",
        "寝る前に気が向いたら試したい占い的なおまじないの由来",
      ],
    },
  };

  const cfg = slotConfig[slot];
  // 日付×スロット×トピック数で毎日違うトピックを選ぶ
  const topicIdx = (getDayOfYearJst() + slot.charCodeAt(0)) % cfg.topics.length;
  const topic = cfg.topics[topicIdx];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `テーマ: ${cfg.theme}
今日の話題: ${topic}
本日の日付: ${getJstDateString()}

上記の話題に沿って、Xに投稿する占いアカウントのツイートを作成してください。`,
      config: {
        systemInstruction: `あなたは「占処（うらないどころ）」というAI占いサイトのX担当です。
占いにまつわる豆知識・雑学を"へえ"と思える軽さで紹介するツイートを書いてください。
"AIっぽい""宗教くさい""詩人ぶった"投稿は絶対NG。物知りな友達が雑談で教えてくれる温度感で。

【文体】
- ${cfg.style}
- 1〜2文、80〜120字程度を目安に
- 体言止めは使わない（冷たく感じるため禁止。必ず動詞・形容詞・助詞で文を締める）
- 語尾は「〜なんだよね」「〜だったりする」「〜なんです」「〜らしいよ」「〜と言われてる」など会話的に
- 「〜です／ます」調でもOKだが、硬くなりすぎないよう「〜なんです」「〜なんですよ」を混ぜる
- 読み終わったときに軽い学びと親しみが残る書き方
- 固有名詞（タロットのカード名、星座名、数秘の数字、地名・時代など）を最低1つは入れる

【絶対禁止ワード・NG表現】
- 「そっと」「静かに」「しっとり」「ふと」「耳を澄ませ」
- 「〜かもしれません」「〜ましょう」「〜ませんか」（詩的提案禁止）
- 「心を整える」「運気を呼び込む」「ご縁」「神秘的」「想いを馳せる」「新たな気づき」
- 「月の光が」「星々が」みたいな自然現象を主語にした美文
- 体言止め（例：「〜な話」「〜の理由」「〜の象徴」で終わらせること）
- 絵文字を2つ以上並べる（🌙✨🔮連打NG）
- 背中を押す押し付けポジティブ（「きっと大丈夫」「今日も素敵な一日を」）
- 事実でない創作雑学（知られていない由来を捏造しない。不確かなら「〜と言われてる」で濁す）

【フォーマット】
- 全角140字以内（ハッシュタグ・改行含む）
- 本文の最後に改行2つを入れてから #占処 #占い を必ず付ける
- 絵文字は0〜1個まで。なしでもOK
- URL・マークダウン不可
- 「当たる」「絶対」「必ず」は禁止（景表法対応）
- 医療・金融・法律の助言はしない

【良い例（この温度感で書く）】
タロットの「死神」って見た目こそ怖いけど、本来は終わりと再生を示すカードで、古い関係や習慣から抜け出す転機を表してたりするんだよね。

#占処 #占い

星座占いのルーツは紀元前のバビロニアまで遡ると言われてて、人類は3000年以上前から星に悩みを相談してたらしいです。歴史長すぎる。

#占処 #占い

数秘術で「7」は探求や内省を司る数字で、考え事が増える時期ほどこの数字に縁があると言われてるんです。

#占処 #占い

【悪い例（絶対に書かない）】
月の光があなたの心に新たな気づきを運ぶかもしれません🌙✨
静かな夜に、そっと耳を澄ませてみませんか。
タロットの「死神」は、終わりと再生の象徴。  ← 体言止めNG

本文のみを返してください。挨拶や前置き、説明は不要。`,
      },
    });

    const text = response.text?.trim();
    if (text && text.length > 10 && text.length <= 140) {
      return text;
    }
    return getFallbackTweet(slot);
  } catch (err) {
    console.error("generateTweetForSlot error:", err);
    return getFallbackTweet(slot);
  }
}

// Gemini利用不可時のフォールバック（毎日違うものを選ぶ）
function getFallbackTweet(slot: TweetSlot): string {
  const fallbacks: Record<TweetSlot, string[]> = {
    midday: [
      "タロットの「愚者」は無謀なキャラに見えて、実は『何も決まってない真っ白な可能性』を表してるカードだったりするんだよね。人生の始まりを示す一枚です。\n\n#占処 #占い",
      "誕生石のルーツは旧約聖書に出てくる胸当ての12の宝石って言われてて、意外と宗教的な背景から始まってるらしいですよ。\n\n#占処 #占い",
      "数秘術で自分の誕生日を一桁まで足した数を「ライフパスナンバー」って呼ぶんだけど、これがけっこう性格を言い当ててて怖いんです。\n\n#占処 #占い",
    ],
    evening: [
      "夢で歯が抜ける現象、日本でも海外でも昔から「身近な変化の前触れ」って語られてきたモチーフで、地味に世界中で似た解釈されてるんですよね。\n\n#占処 #占い",
      "「鏡が割れると7年不幸になる」って迷信、ルーツは古代ローマで当時の鏡は魂が戻るのに7年かかると考えられてたからって言われてます。\n\n#占処 #占い",
      "手相の生命線、短くても寿命が短いって意味じゃないんです。どちらかと言うと『エネルギーの使い方』を表す線だったりします。\n\n#占処 #占い",
    ],
    night: [
      "満月の夜に眠りが浅くなる人、実は昔から世界中で報告されてて、占星術でも「月が感情を揺らす」と言われてきたんですよね。\n\n#占処 #占い",
      "数秘術で「9」は一つのサイクルの終わりを示す数字で、区切りを意識するのにちょうどいいタイミングと言われてるんです。\n\n#占処 #占い",
      "古代エジプトの人たちは夜空の星の並びで農作業の時期まで占ってたらしくて、占星術って元々すごく実用的なものだったんだよね。\n\n#占処 #占い",
    ],
  };
  const list = fallbacks[slot];
  return list[getDayOfYearJst() % list.length];
}

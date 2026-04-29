import { GoogleGenAI } from "@google/genai";
import { blogArticles } from "@/lib/blog-data";
import { redis } from "@/lib/redis";

export type TweetSlot = "midday" | "evening" | "night";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const SITE_URL = "https://uranaidokoro.com";
const TWEET_HISTORY_TTL_SEC = 14 * 24 * 60 * 60; // 14日

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

// =====================================================
// 記事紹介ツイート（evening 18:00 枠）
// 候補は blogArticles + 夢占いトレンドページ。
// Redisで投稿履歴を14日保持し、被らないようランダム選択する。
// =====================================================

type PromoTarget = {
  /** Redis投稿履歴キーに使うID */
  key: string;
  /** ツイート用タイトル（記事タイトルやページ名） */
  title: string;
  /** 紹介文生成用の概要 */
  description: string;
  /** 投稿先URL */
  url: string;
};

function getPromoTargets(): PromoTarget[] {
  const targets: PromoTarget[] = blogArticles.map((a) => ({
    key: `blog:${a.slug}`,
    title: a.title,
    description: a.description,
    url: `${SITE_URL}/blog/${a.slug}`,
  }));
  // 夢占いトレンドページもローテに含める（月次キャッシュバスト用クエリ付き）
  const jst = getJstDate();
  const monthQuery = `?m=${jst.getUTCFullYear()}-${String(jst.getUTCMonth() + 1).padStart(2, "0")}`;
  targets.push({
    key: "page:dream-trends",
    title: "夢占いトレンド",
    description:
      "今月みんなが見た夢を匿名集計したワード雲とTOP20。気になる夢をクリックして即占える。",
    url: `${SITE_URL}/dream-trends${monthQuery}`,
  });
  return targets;
}

async function selectFreshPromoTarget(): Promise<PromoTarget> {
  const targets = getPromoTargets();
  if (targets.length === 0) {
    throw new Error("No promo targets available");
  }

  // Redisがない場合は単純ランダム
  if (!redis) {
    return targets[Math.floor(Math.random() * targets.length)];
  }

  try {
    const historyKeys = targets.map((t) => `tweet:posted:${t.key}`);
    const recent = await redis.mget<(string | null)[]>(...historyKeys);
    const fresh = targets.filter((_, i) => !recent[i]);
    // 全部投稿済みなら全候補から（14日経過待たずに古いほど再利用される運用上はOK）
    const pool = fresh.length > 0 ? fresh : targets;
    return pool[Math.floor(Math.random() * pool.length)];
  } catch (err) {
    console.error("selectFreshPromoTarget redis error:", err);
    return targets[Math.floor(Math.random() * targets.length)];
  }
}

// 投稿成功後に呼び出して14日のクールダウンを記録する
export async function markPromoTargetPosted(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(`tweet:posted:${key}`, "1", { ex: TWEET_HISTORY_TTL_SEC });
  } catch (err) {
    console.error("markPromoTargetPosted redis error:", err);
  }
}

function buildPromoTweet(target: PromoTarget, intro: string): string {
  return `${intro}\n\n${target.url}\n\n#占処 #占い`;
}

export type ArticlePromoTweet = {
  text: string;
  key: string;
};

export async function generateArticlePromoTweet(): Promise<ArticlePromoTweet> {
  const target = await selectFreshPromoTarget();

  if (!ai) {
    // Gemini不可時は説明文をそのまま使ったテンプレ
    const intro = `🔮 占処コラム「${target.title}」\n\n${truncate(target.description, 60)}`;
    return { text: buildPromoTweet(target, ensureLength(intro, 100)), key: target.key };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `紹介する記事タイトル: ${target.title}
記事の概要: ${target.description}

このコンテンツに興味を持ってもらえる紹介ツイートの本文を1つ書いてください。`,
      config: {
        systemInstruction: `あなたは「占処（うらないどころ）」というAI占いサイトのX担当です。
ブログ記事や占い機能ページへのリンクをツイートで紹介し、読者にクリックしてもらうのが目的です。

【文体】
- 物知りな友達が雑談で「これ読んでみて」と勧める温度感
- 1〜2文、60〜85字程度（後でURLとハッシュタグが追加されるため）
- 体言止め禁止。動詞・形容詞・助詞で文を締める
- 語尾は「〜なんだよね」「〜なんです」「〜あったりする」「〜になっている」など会話的に
- タイトルそのままを使うのではなく、「中身が気になる切り口」を一言で要約する
- 読者が「気になるからクリックしてみよう」と思える書き方
- 固有名詞（カード名、星座名、数字など）が記事に関係するなら積極的に使ってOK
- 絵文字は0〜1個まで（🔮 ✨ 🌙 など。連打NG）

【絶対NG】
- 「そっと」「静かに」「しっとり」「ふと」「耳を澄ませ」
- 「〜かもしれません」「〜ましょう」「〜ませんか」（詩的提案禁止）
- 「心を整える」「運気を呼び込む」「ご縁」「神秘的」「想いを馳せる」「新たな気づき」
- 体言止め
- 押し付けポジティブ「きっと大丈夫」「素敵な一日を」
- URLやハッシュタグは入れない（呼び出し側で付与する）
- 「当たる」「絶対」「必ず」（景表法）

【良い例】
タロットの「死神」って怖そうな見た目で誤解されがちだけど、実は終わりと再生を示すカードで、転機を表すんだよね。意味の正しい読み方をまとめてみました。

「○月生まれは○○な傾向」みたいな星座解説、根拠はギリシャ神話だったりするんです。2026年の年間運勢、自分の星座だけでもチェックしておくと話のネタにもなる感じ。

🌙 「最近こんな夢をよく見る」って人、地味に世界中で似た解釈されてるパターンがあったりします。今月みんながどんな夢を見てるかワード雲で見られるよ。

【悪い例】
そっと心を整える、占いの世界へ。  ← 詩的禁止 体言止め禁止
タロットの死神は終わりと再生の象徴。  ← 体言止め禁止
当たる占いを今すぐ試そう  ← 「当たる」NG

本文のみを返してください。挨拶や前置き、説明、URL、ハッシュタグは不要。`,
      },
    });

    const intro = response.text?.trim() ?? "";
    if (intro.length < 10 || intro.length > 100) {
      // 想定外の長さならフォールバック
      const fallback = `🔮 占処コラム「${target.title}」\n\n${truncate(target.description, 60)}`;
      return { text: buildPromoTweet(target, ensureLength(fallback, 100)), key: target.key };
    }
    return { text: buildPromoTweet(target, intro), key: target.key };
  } catch (err) {
    console.error("generateArticlePromoTweet error:", err);
    const intro = `🔮 占処コラム「${target.title}」\n\n${truncate(target.description, 60)}`;
    return { text: buildPromoTweet(target, ensureLength(intro, 100)), key: target.key };
  }
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

function ensureLength(s: string, n: number): string {
  return s.length <= n ? s : truncate(s, n);
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

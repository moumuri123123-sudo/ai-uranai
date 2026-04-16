import { GoogleGenAI } from "@google/genai";
import {
  type FortuneRequest,
  type FortuneType,
  tarotCards,
  zodiacSigns,
  mbtiTypes,
  pickRandom,
  isReversed,
  generateTarotReading,
  generateZodiacReading,
  generateCompatibilityReading,
  generateMbtiReading,
  generateDreamReading,
  generateNumerologyReading,
} from "@/lib/fortune-data";
import { calculateLifePath } from "@/lib/numerology";

// Gemini クライアント（APIキーが設定されている場合のみ有効）
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey && apiKey !== "ここにAPIキーを貼り付け" ? new GoogleGenAI({ apiKey }) : null;
const MODEL = "gemini-2.5-flash";


// ===== レート制限 =====
//
// 警告: このレート制限はベストエフォートでしか機能しません。
// Vercelのサーバーレス環境では各インスタンスごとに独立したメモリを持ち、
// Map は共有されないため、厳密な制限にはなりません。
// 第一防衛線として機能するのみであり、厳密な制限が必要な場合は
// Vercel KV や Upstash Redis などの共有ストレージに移行する必要があります。

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1分
const RATE_LIMIT_MAX = 10; // 1分間に最大10リクエスト
const DAILY_LIMIT_MAX = 50; // 1日最大50リクエスト

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

type DailyLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();
const dailyLimitMap = new Map<string, DailyLimitEntry>();

// 古いエントリを定期的にクリーンアップ（メモリリーク防止）
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
  for (const [key, entry] of dailyLimitMap) {
    if (now > entry.resetTime) {
      dailyLimitMap.delete(key);
    }
  }
}, 60 * 1000);

function getClientIp(req: Request): string {
  // Vercel固有の信頼できるヘッダーを優先。x-forwarded-forはクライアントが
  // 任意に偽装可能なため、最終フォールバックとしてのみ使用する。
  const vercelForwarded = req.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    const first = vercelForwarded.split(",")[0].trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    const trimmed = realIp.trim();
    if (trimmed) return trimmed;
  }
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number; daily?: boolean; remaining?: number } {
  const now = Date.now();

  // 1日の制限チェック
  const dailyEntry = dailyLimitMap.get(ip);
  if (dailyEntry && now <= dailyEntry.resetTime) {
    if (dailyEntry.count >= DAILY_LIMIT_MAX) {
      const retryAfter = Math.ceil((dailyEntry.resetTime - now) / 1000);
      return { allowed: false, retryAfter, daily: true, remaining: 0 };
    }
  }

  // 1分の制限チェック
  const entry = rateLimitMap.get(ip);
  let currentMinuteCount: number;

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    currentMinuteCount = 1;
  } else if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter, remaining: 0 };
  } else {
    entry.count++;
    currentMinuteCount = entry.count;
  }

  // 1日のカウントを更新
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  if (!dailyEntry || now > dailyEntry.resetTime) {
    dailyLimitMap.set(ip, { count: 1, resetTime: now + MS_PER_DAY });
  } else {
    dailyEntry.count++;
  }

  const remaining = Math.max(0, RATE_LIMIT_MAX - currentMinuteCount);
  return { allowed: true, remaining };
}

// ===== プロンプト構築 =====

function buildTarotPrompt(
  question: string,
  messages: FortuneRequest["messages"],
  tarotTheme?: string,
  tarotCard?: string,
  tarotReversed?: boolean,
  tarotCardsArr?: Array<{ name: string; reversed: boolean; position: string }>,
  tarotSpread?: string,
  tarotQuestion?: string,
): {
  systemInstruction: string;
  userMessage: string;
} {
  const themeLabel = tarotTheme || "総合";
  const isAutoReading = messages.length === 0;
  const userQ = tarotQuestion || "";

  // スリーカードスプレッド
  if (tarotSpread === "three" && tarotCardsArr && tarotCardsArr.length === 3) {
    const cardDescriptions = tarotCardsArr.map((c) => {
      const found = tarotCards.find(tc => tc.name === c.name);
      const pos = c.reversed ? "逆位置" : "正位置";
      const kw = found ? (c.reversed ? found.reversedMeaning : found.meaning) : "";
      return `${c.position}：「${c.name}」の${pos}（${kw}）`;
    }).join("\n");

    const systemInstruction = `あなたは経験豊富で親しみやすいタロット占い師です。
丁寧なですます口調で、相談者に寄り添うように話してください。
絵文字は使わないでください。マークダウン記法も使わないでください。
回答は500〜800文字程度にしてください。

【重要な話し方のルール】
- 「あなたは○○な方ですね」「あなたには○○な力があります」のように、相談者自身について断言する言い回しを使ってください。
- 「○○してみてください」「今週は○○を意識すると良いでしょう」のように、すぐ行動できる具体的なアドバイスを必ず含めてください。
- 「応援しています」「きっとうまくいきます」のような漠然とした励ましだけで終わらないでください。
- 回答の最後は、相談者が思わず答えたくなるような問いかけや、「もう少し深く見てみましょうか？」のような会話の続きを促す一言で締めてください。

【スプレッド】スリーカード（過去・現在・未来）
【相談者の悩み】${userQ || themeLabel + "について"}
【テーマ】${themeLabel}

${cardDescriptions}

${isAutoReading
  ? `3枚のカードを一つの「物語」として読み解いてください。
まず各カードの意味を簡潔に説明し、次に過去→現在→未来の流れとしてストーリーを組み立ててください。
カード同士の関係性（共通するテーマ、対比、流れの変化）にも触れてください。
相談者の状況を「あなたは○○です」と断言しながら鑑定し、具体的な行動のアドバイスを伝えてください。`
  : `これまでのリーディングを踏まえて、相談者の追加の質問に答えてください。
カードの解釈をさらに深掘りしたり、別の観点からアドバイスを加えてください。`}`;

    const conversationContext = messages.length > 0
      ? "\n\n【これまでの会話】\n" + messages.map(m => `${m.role === "user" ? "相談者" : "占い師"}: ${m.content}`).join("\n")
      : "";

    const userMessage = isAutoReading
      ? `スリーカードスプレッドでカードを引きました。「${themeLabel}」について、${userQ ? `「${userQ}」という悩みを` : ""}占ってください。`
      : `${conversationContext}\n\n相談者の質問: ${question}`;

    return { systemInstruction, userMessage };
  }

  // ワンオラクル（1枚引き）
  let cardName: string;
  let position: string;
  let meaning: string;

  if (tarotCard) {
    const foundCard = tarotCards.find(c => c.name === tarotCard);
    const reversed = tarotReversed ?? false;
    cardName = tarotCard;
    position = reversed ? "逆位置" : "正位置";
    meaning = foundCard ? (reversed ? foundCard.reversedMeaning : foundCard.meaning) : "";
  } else {
    const card = pickRandom(tarotCards);
    const reversed = isReversed();
    cardName = card.name;
    position = reversed ? "逆位置" : "正位置";
    meaning = reversed ? card.reversedMeaning : card.meaning;
  }

  const systemInstruction = `あなたは経験豊富で親しみやすいタロット占い師です。
丁寧なですます口調で、相談者に寄り添うように話してください。
絵文字は使わないでください。マークダウン記法も使わないでください。
回答は300〜500文字程度にしてください。

【重要な話し方のルール】
- 「あなたは○○な方ですね」「あなたには○○な力があります」のように、相談者自身について断言する言い回しを使ってください。
- 「○○してみてください」「今週は○○を意識すると良いでしょう」のように、すぐ行動できる具体的なアドバイスを必ず含めてください。
- 「応援しています」「きっとうまくいきます」のような漠然とした励ましだけで終わらないでください。
- 回答の最後は、相談者が思わず答えたくなるような問いかけや、「もう少し深く見てみましょうか？」のような会話の続きを促す一言で締めてください。

【スプレッド】ワンオラクル（1枚引き）
【相談者の悩み】${userQ || themeLabel + "について"}
【テーマ】${themeLabel}

引いたカード：「${cardName}」の${position}
キーワード：${meaning}

${isAutoReading
    ? `相談者がカードを引きました。このカードの意味を読み解き、相談者の悩みに寄り添って占い結果を伝えてください。
まず「${cardName}」の${position}がどのようなカードかを説明し、それが相談者の悩みに対して何を示しているか詳しく鑑定してください。
カード名と正逆位置、キーワードは必ず回答に含めてください。
相談者の状況を「あなたは○○です」と断言しながら鑑定し、具体的な行動のアドバイスを伝えてください。`
    : `これまでのリーディングを踏まえて、相談者の追加の質問に答えてください。
カードの解釈をさらに深掘りしたり、別の観点からアドバイスを加えてください。`}`;

  const conversationContext = messages.length > 0
    ? "\n\n【これまでの会話】\n" + messages.map(m => `${m.role === "user" ? "相談者" : "占い師"}: ${m.content}`).join("\n")
    : "";

  const userMessage = isAutoReading
    ? `カードを引きました。「${cardName}」の${position}です。「${themeLabel}」について、${userQ ? `「${userQ}」という悩みを` : ""}占ってください。`
    : `${conversationContext}\n\n相談者の質問: ${question}`;

  return { systemInstruction, userMessage };
}

function buildZodiacPrompt(question: string, zodiacSign: string | undefined, messages: FortuneRequest["messages"]): {
  systemInstruction: string;
  userMessage: string;
} {
  const sign = zodiacSign ? zodiacSigns[zodiacSign] : undefined;
  const signName = sign?.name || "不明";
  const signTraits = sign?.traits || "";
  const signElement = sign?.element || "";

  const systemInstruction = `あなたは親しみやすい占い師です。星座占いを担当しています。
丁寧なですます口調で、相談者に寄り添うように話してください。
絵文字は使わないでください。マークダウン記法も使わないでください。
回答は300〜500文字程度にしてください。

【重要な話し方のルール】
- 「あなたは○○な方ですね」「あなたには○○な力があります」のように、相談者自身について断言する言い回しを使ってください。
- 「○○してみてください」「今週は○○を意識すると良いでしょう」のように、すぐ行動できる具体的なアドバイスを必ず含めてください。
- 「応援しています」「きっとうまくいきます」のような漠然とした励ましだけで終わらないでください。
- 回答の最後は、相談者が思わず答えたくなるような問いかけや、「もう少し深く見てみましょうか？」のような会話の続きを促す一言で締めてください。

相談者の星座：${signName}
${signTraits ? `星座の特徴：${signTraits}` : ""}
${signElement ? `エレメント：${signElement}` : ""}

この星座の特徴を踏まえて、「あなたは○○座なので○○です」と断言しながら占い結果を伝えてください。
ラッキーデーやラッキーカラーなど具体的なアドバイスも入れてください。`;

  const conversationContext = messages.length > 0
    ? "\n\n【これまでの会話】\n" + messages.map(m => `${m.role === "user" ? "相談者" : "占い師"}: ${m.content}`).join("\n")
    : "";

  const userMessage = `${conversationContext}\n\n相談者の質問: ${question}`;

  return { systemInstruction, userMessage };
}

function buildCompatibilityPrompt(question: string, person1: string | undefined, person2: string | undefined, messages: FortuneRequest["messages"], compatibilityScore?: number): {
  systemInstruction: string;
  userMessage: string;
} {
  const name1 = person1 || "あなた";
  const name2 = person2 || "お相手";
  // クライアントから送られた相性度があればそれを使う（会話を跨いだ一貫性維持）。
  // なければ初回用にランダム生成（60-100）。
  const score = typeof compatibilityScore === "number"
    ? compatibilityScore
    : Math.floor(Math.random() * 41) + 60;

  const systemInstruction = `あなたは親しみやすい占い師です。相性占いを担当しています。
丁寧なですます口調で、相談者に寄り添うように話してください。
絵文字は使わないでください。マークダウン記法も使わないでください。
回答は300〜500文字程度にしてください。

【重要な話し方のルール】
- 「あなたは○○な方ですね」「あなたには○○な力があります」のように、相談者自身について断言する言い回しを使ってください。
- 「○○してみてください」「今週は○○を意識すると良いでしょう」のように、すぐ行動できる具体的なアドバイスを必ず含めてください。
- 「応援しています」「きっとうまくいきます」のような漠然とした励ましだけで終わらないでください。
- 回答の最後は、相談者が思わず答えたくなるような問いかけや、「もう少し深く見てみましょうか？」のような会話の続きを促す一言で締めてください。

占う2人：${name1}さんと${name2}さん
相性度：${score}%

この相性度をもとに、2人の相性について占い結果を伝えてください。
相性度のパーセンテージは必ず回答に含めてください。
「${name1}さんは○○なタイプで、${name2}さんは○○なタイプです」のように断言しながら、2人の関係をより良くするための具体的な行動アドバイスを入れてください。`;

  const conversationContext = messages.length > 0
    ? "\n\n【これまでの会話】\n" + messages.map(m => `${m.role === "user" ? "相談者" : "占い師"}: ${m.content}`).join("\n")
    : "";

  const userMessage = `${conversationContext}\n\n相談者の質問: ${question}`;

  return { systemInstruction, userMessage };
}

function buildMbtiPrompt(question: string, mbtiType: string | undefined, messages: FortuneRequest["messages"]): {
  systemInstruction: string;
  userMessage: string;
} {
  const typeData = mbtiType ? mbtiTypes[mbtiType] : undefined;
  const typeName = typeData ? `${typeData.code}（${typeData.name}）` : "不明";
  const typeTraits = typeData?.traits || "";
  const compatibleTypes = typeData?.compatibleTypes.map(c => `${c}（${mbtiTypes[c]?.name}）`).join("、") || "";

  const systemInstruction = `あなたは親しみやすい占い師で、MBTI性格診断のスペシャリストです。
丁寧なですます口調で、相談者に寄り添うように話してください。
絵文字は使わないでください。マークダウン記法も使わないでください。
回答は300〜500文字程度にしてください。

【重要な話し方のルール】
- 「あなたは○○な方ですね」「あなたには○○な力があります」のように、相談者自身について断言する言い回しを使ってください。
- 「○○してみてください」「今週は○○を意識すると良いでしょう」のように、すぐ行動できる具体的なアドバイスを必ず含めてください。
- 「応援しています」「きっとうまくいきます」のような漠然とした励ましだけで終わらないでください。
- 回答の最後は、相談者が思わず答えたくなるような問いかけや、「もう少し深く見てみましょうか？」のような会話の続きを促す一言で締めてください。

相談者のMBTIタイプ：${typeName}
${typeTraits ? `タイプの特徴：${typeTraits}` : ""}
${compatibleTypes ? `相性の良いタイプ：${compatibleTypes}` : ""}

「あなたは${typeName}タイプなので○○です」と断言しながら、タイプの強みや弱み、人間関係のコツなど具体的な行動アドバイスを伝えてください。`;

  const conversationContext = messages.length > 0
    ? "\n\n【これまでの会話】\n" + messages.map(m => `${m.role === "user" ? "相談者" : "占い師"}: ${m.content}`).join("\n")
    : "";

  const userMessage = `${conversationContext}\n\n相談者の質問: ${question}`;

  return { systemInstruction, userMessage };
}

function buildDreamPrompt(question: string, dreamKeyword: string | undefined, messages: FortuneRequest["messages"]): {
  systemInstruction: string;
  userMessage: string;
} {
  const keyword = dreamKeyword || "不思議な夢";

  const systemInstruction = `あなたは親しみやすい占い師で、夢占いのスペシャリストです。
丁寧なですます口調で、相談者に寄り添うように話してください。
絵文字は使わないでください。マークダウン記法も使わないでください。
回答は300〜500文字程度にしてください。

【重要な話し方のルール】
- 「あなたは○○な方ですね」「あなたには○○な力があります」のように、相談者自身について断言する言い回しを使ってください。
- 「○○してみてください」「今週は○○を意識すると良いでしょう」のように、すぐ行動できる具体的なアドバイスを必ず含めてください。
- 「応援しています」「きっとうまくいきます」のような漠然とした励ましだけで終わらないでください。
- 回答の最後は、相談者が思わず答えたくなるような問いかけや、「もう少し深く見てみましょうか？」のような会話の続きを促す一言で締めてください。

相談者が見た夢のキーワード：「${keyword}」

この夢のキーワードから、夢が象徴する意味を読み解いてください。
「あなたは今○○な状態にあるのかもしれません」のように断言しながら、心理学的な観点と伝統的な夢占いの両方を織り交ぜて解釈してください。
夢が示す深層心理や、現在の生活との関連についても触れ、具体的な行動アドバイスを伝えてください。`;

  const conversationContext = messages.length > 0
    ? "\n\n【これまでの会話】\n" + messages.map(m => `${m.role === "user" ? "相談者" : "占い師"}: ${m.content}`).join("\n")
    : "";

  const userMessage = `${conversationContext}\n\n相談者の質問: ${question}`;

  return { systemInstruction, userMessage };
}

function buildNumerologyPrompt(question: string, birthDate: string | undefined, messages: FortuneRequest["messages"]): {
  systemInstruction: string;
  userMessage: string;
} {
  let lifePathInfo = "";
  if (birthDate) {
    const sum = calculateLifePath(birthDate);
    lifePathInfo = `生年月日：${birthDate}\nライフパスナンバー：${sum}`;
  }

  const systemInstruction = `あなたは親しみやすい占い師で、数秘術のスペシャリストです。
丁寧なですます口調で、相談者に寄り添うように話してください。
絵文字は使わないでください。マークダウン記法も使わないでください。
回答は300〜500文字程度にしてください。

【重要な話し方のルール】
- 「あなたは○○な方ですね」「あなたには○○な力があります」のように、相談者自身について断言する言い回しを使ってください。
- 「○○してみてください」「今週は○○を意識すると良いでしょう」のように、すぐ行動できる具体的なアドバイスを必ず含めてください。
- 「応援しています」「きっとうまくいきます」のような漠然とした励ましだけで終わらないでください。
- 回答の最後は、相談者が思わず答えたくなるような問いかけや、「もう少し深く見てみましょうか？」のような会話の続きを促す一言で締めてください。

${lifePathInfo}

「あなたはライフパスナンバー○のもとに生まれた○○な方です」と断言しながら、この数字が示す性格の特徴、人生の使命、才能について占い結果を伝えてください。
恋愛・仕事・人間関係について具体的な行動アドバイスも入れてください。`;

  const conversationContext = messages.length > 0
    ? "\n\n【これまでの会話】\n" + messages.map(m => `${m.role === "user" ? "相談者" : "占い師"}: ${m.content}`).join("\n")
    : "";

  const userMessage = `${conversationContext}\n\n相談者の質問: ${question}`;

  return { systemInstruction, userMessage };
}

// ===== フォールバック用モック生成 =====

function generateFallbackText(request: FortuneRequest): string {
  switch (request.type) {
    case "tarot":
      return generateTarotReading(request.question);
    case "zodiac":
      return generateZodiacReading(request.question, request.zodiacSign);
    case "compatibility":
      return generateCompatibilityReading(request.question, request.person1, request.person2);
    case "mbti":
      return generateMbtiReading(request.question, request.mbtiType);
    case "dream":
      return generateDreamReading(request.question, request.dreamKeyword);
    case "numerology":
      return generateNumerologyReading(request.question, request.birthDate);
    default:
      return "申し訳ございません。対応していない占いの種類です。";
  }
}

// ===== モック用ストリーミング（1文字ずつ送信） =====

const STREAM_DELAY_MS = 50;

function createMockStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const char of text) {
        controller.enqueue(encoder.encode(char));
        await new Promise((resolve) => setTimeout(resolve, STREAM_DELAY_MS));
      }
      controller.close();
    },
  });
}

// ===== バリデーション =====

function isValidFortuneType(type: string): type is FortuneType {
  return ["tarot", "zodiac", "compatibility", "mbti", "dream", "numerology"].includes(type);
}

function isValidBirthDate(birthDate: string): boolean {
  // YYYY-MM-DD 形式チェック
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return false;

  const [yearStr, monthStr, dayStr] = birthDate.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Dateで厳密にパースして、月末日などの整合性をチェック
  const parsed = new Date(`${birthDate}T00:00:00Z`);
  if (isNaN(parsed.getTime())) return false;

  // パース結果が入力と一致するか（例：2月30日など無効日付を検出）
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() + 1 !== month ||
    parsed.getUTCDate() !== day
  ) {
    return false;
  }

  // 未来日付は不可
  const now = Date.now();
  if (parsed.getTime() > now) return false;

  return true;
}

// ===== メインハンドラー =====

export async function POST(req: Request) {
  try {
    // レート制限チェック
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      const message = rateCheck.daily
        ? "本日の占い回数の上限（50回）に達しました。明日またお越しください。"
        : "リクエストが多すぎます。しばらくしてからお試しください。";
      return Response.json(
        { error: message },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfter),
            "X-RateLimit-Remaining": String(rateCheck.remaining ?? 0),
          },
        },
      );
    }
    const rateLimitRemaining = String(rateCheck.remaining ?? 0);

    const body = await req.json();

    // バリデーション
    if (!body.type || !isValidFortuneType(body.type)) {
      return Response.json(
        { error: "占いの種類を指定してください。" },
        { status: 400 },
      );
    }

    // tarotの自動鑑定時はquestionが"__auto__"で送られる
    if (!body.question || typeof body.question !== "string" || body.question.trim() === "") {
      return Response.json(
        { error: "質問を入力してください。" },
        { status: 400 },
      );
    }

    if (body.question.length > 500) {
      return Response.json(
        { error: "質問は500文字以内で入力してください。" },
        { status: 400 },
      );
    }

    // 数秘術の場合は生年月日の形式と値を厳密にチェック
    if (body.type === "numerology") {
      if (typeof body.birthDate !== "string" || !isValidBirthDate(body.birthDate)) {
        return Response.json(
          { error: "生年月日の形式が正しくありません" },
          { status: 400 },
        );
      }
    }

    // 会話履歴のバリデーション（最大20件、各メッセージ1000文字以内）
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    const validatedMessages = rawMessages
      .slice(-20)
      .filter(
        (m: Record<string, unknown>) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.length <= 1000
      )
      .map((m: Record<string, unknown>) => ({
        role: m.role as "user" | "assistant",
        content: (m.content as string).slice(0, 1000),
      }));

    // person1/person2/zodiacSign/mbtiTypeの長さ制限
    const sanitize = (val: unknown, maxLen: number): string | undefined => {
      if (typeof val !== "string") return undefined;
      return val.slice(0, maxLen);
    };

    const request: FortuneRequest = {
      type: body.type,
      question: body.question.trim(),
      messages: validatedMessages,
      zodiacSign: sanitize(body.zodiacSign, 20),
      person1: sanitize(body.person1, 50),
      person2: sanitize(body.person2, 50),
      mbtiType: sanitize(body.mbtiType, 10),
      dreamKeyword: sanitize(body.dreamKeyword, 100),
      birthDate: sanitize(body.birthDate, 20),
      tarotTheme: sanitize(body.tarotTheme, 20),
      tarotCard: sanitize(body.tarotCard, 20),
      tarotReversed: typeof body.tarotReversed === "boolean" ? body.tarotReversed : undefined,
      tarotSpread: sanitize(body.tarotSpread, 10),
      tarotQuestion: sanitize(body.tarotQuestion, 500),
      tarotCards: Array.isArray(body.tarotCards)
        ? body.tarotCards.slice(0, 10).filter(
            (c: Record<string, unknown>) =>
              typeof c.name === "string" && c.name.length <= 20 &&
              typeof c.reversed === "boolean" &&
              typeof c.position === "string" && c.position.length <= 10
          ).map((c: Record<string, unknown>) => ({
            name: (c.name as string).slice(0, 20),
            reversed: c.reversed as boolean,
            position: (c.position as string).slice(0, 10),
          }))
        : undefined,
      compatibilityScore:
        typeof body.compatibilityScore === "number" &&
        Number.isFinite(body.compatibilityScore) &&
        body.compatibilityScore >= 60 &&
        body.compatibilityScore <= 100
          ? Math.floor(body.compatibilityScore)
          : undefined,
    };

    // Gemini APIが使えない場合はモックにフォールバック
    if (!ai) {
      const fallbackText = generateFallbackText(request);
      return new Response(createMockStream(fallbackText), {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-RateLimit-Remaining": rateLimitRemaining,
        },
      });
    }

    // プロンプト構築
    let systemInstruction: string;
    let userMessage: string;

    switch (request.type) {
      case "tarot": {
        const prompt = buildTarotPrompt(request.question, request.messages, request.tarotTheme, request.tarotCard, request.tarotReversed, request.tarotCards, request.tarotSpread, request.tarotQuestion);
        systemInstruction = prompt.systemInstruction;
        userMessage = prompt.userMessage;
        break;
      }
      case "zodiac": {
        const prompt = buildZodiacPrompt(request.question, request.zodiacSign, request.messages);
        systemInstruction = prompt.systemInstruction;
        userMessage = prompt.userMessage;
        break;
      }
      case "compatibility": {
        const prompt = buildCompatibilityPrompt(request.question, request.person1, request.person2, request.messages, request.compatibilityScore);
        systemInstruction = prompt.systemInstruction;
        userMessage = prompt.userMessage;
        break;
      }
      case "mbti": {
        const prompt = buildMbtiPrompt(request.question, request.mbtiType, request.messages);
        systemInstruction = prompt.systemInstruction;
        userMessage = prompt.userMessage;
        break;
      }
      case "dream": {
        const prompt = buildDreamPrompt(request.question, request.dreamKeyword, request.messages);
        systemInstruction = prompt.systemInstruction;
        userMessage = prompt.userMessage;
        break;
      }
      case "numerology": {
        const prompt = buildNumerologyPrompt(request.question, request.birthDate, request.messages);
        systemInstruction = prompt.systemInstruction;
        userMessage = prompt.userMessage;
        break;
      }
    }

    // 全占いに共通する安全性ガイドライン（医療・法律・金融の助言を避ける）
    const SAFETY_GUIDELINE = `\n\n【重要】病気の診断・治療・予防に関する助言は行わないでください。医療・法律・金融に関する具体的な判断・アドバイスは避け、必要な場合は「専門家にご相談ください」と返してください。`;
    const safeSystemInstruction = systemInstruction + SAFETY_GUIDELINE;

    // Gemini APIストリーミング呼び出し
    try {
      const response = await ai.models.generateContentStream({
        model: MODEL,
        contents: userMessage,
        config: {
          systemInstruction: safeSystemInstruction,
        },
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              if (chunk.text) {
                controller.enqueue(encoder.encode(chunk.text));
              }
            }
            controller.close();
          } catch (err) {
            // ストリーミング中にエラーが発生した場合
            console.error("Gemini stream error:", err);
            try {
              controller.enqueue(
                encoder.encode(
                  "\n\n[ERROR:stream_interrupted]\n\n※ 通信エラーが発生しました。もう一度お試しください。",
                ),
              );
            } catch {
              // enqueueが失敗した場合は無視
            }
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-RateLimit-Remaining": rateLimitRemaining,
        },
      });
    } catch (e) {
      // Gemini APIエラー時はモックにフォールバック

      const fallbackText = generateFallbackText(request);
      return new Response(createMockStream(fallbackText), {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-RateLimit-Remaining": rateLimitRemaining,
        },
      });
    }
  } catch {
    return Response.json(
      { error: "占いの処理中にエラーが発生しました。もう一度お試しください。" },
      { status: 500 },
    );
  }
}

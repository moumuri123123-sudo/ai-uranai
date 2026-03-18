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

// Gemini クライアント（APIキーが設定されている場合のみ有効）
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey && apiKey !== "ここにAPIキーを貼り付け" ? new GoogleGenAI({ apiKey }) : null;
const MODEL = "gemini-2.5-flash";


// ===== レート制限 =====

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1分
const RATE_LIMIT_MAX = 10; // 1分間に最大10リクエスト

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

// 古いエントリを定期的にクリーンアップ（メモリリーク防止）
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000);

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

// ===== プロンプト構築 =====

function buildTarotPrompt(question: string, messages: FortuneRequest["messages"], tarotTheme?: string): {
  systemInstruction: string;
  userMessage: string;
} {
  const card = pickRandom(tarotCards);
  const reversed = isReversed();
  const position = reversed ? "逆位置" : "正位置";
  const meaning = reversed ? card.reversedMeaning : card.meaning;
  const themeLabel = tarotTheme || "総合";

  const systemInstruction = `あなたは親しみやすい占い師です。タロット占いを担当しています。
丁寧なですます口調で、相談者に寄り添うように話してください。
絵文字は使わないでください。マークダウン記法も使わないでください。
回答は300〜500文字程度にしてください。

今回引いたカード：「${card.name}」の${position}
キーワード：${meaning}
占いのテーマ：${themeLabel}

このカードの意味を踏まえて、特に「${themeLabel}」の観点から相談者の質問に対して占い結果を伝えてください。
カード名と正逆位置、キーワードは必ず回答に含めてください。
最後に前向きな一言を添えてください。`;

  const conversationContext = messages.length > 0
    ? "\n\n【これまでの会話】\n" + messages.map(m => `${m.role === "user" ? "相談者" : "占い師"}: ${m.content}`).join("\n")
    : "";

  const userMessage = `${conversationContext}\n\n相談者の質問: ${question}`;

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

相談者の星座：${signName}
${signTraits ? `星座の特徴：${signTraits}` : ""}
${signElement ? `エレメント：${signElement}` : ""}

この星座の特徴を踏まえて、相談者の質問に対して占い結果を伝えてください。
ラッキーデーやラッキーカラーなど具体的なアドバイスも入れてください。
最後に前向きな一言を添えてください。`;

  const conversationContext = messages.length > 0
    ? "\n\n【これまでの会話】\n" + messages.map(m => `${m.role === "user" ? "相談者" : "占い師"}: ${m.content}`).join("\n")
    : "";

  const userMessage = `${conversationContext}\n\n相談者の質問: ${question}`;

  return { systemInstruction, userMessage };
}

function buildCompatibilityPrompt(question: string, person1: string | undefined, person2: string | undefined, messages: FortuneRequest["messages"]): {
  systemInstruction: string;
  userMessage: string;
} {
  const name1 = person1 || "あなた";
  const name2 = person2 || "お相手";
  const score = Math.floor(Math.random() * 41) + 60; // 60-100

  const systemInstruction = `あなたは親しみやすい占い師です。相性占いを担当しています。
丁寧なですます口調で、相談者に寄り添うように話してください。
絵文字は使わないでください。マークダウン記法も使わないでください。
回答は300〜500文字程度にしてください。

占う2人：${name1}さんと${name2}さん
相性度：${score}%

この相性度をもとに、2人の相性について占い結果を伝えてください。
相性度のパーセンテージは必ず回答に含めてください。
2人の関係をより良くするための具体的なアドバイスも入れてください。
最後に前向きな一言を添えてください。`;

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

相談者のMBTIタイプ：${typeName}
${typeTraits ? `タイプの特徴：${typeTraits}` : ""}
${compatibleTypes ? `相性の良いタイプ：${compatibleTypes}` : ""}

このMBTIタイプの特徴を踏まえて、相談者の質問に対してアドバイスを伝えてください。
タイプの強みや弱み、人間関係のコツなど具体的なアドバイスも入れてください。
最後に前向きな一言を添えてください。`;

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

相談者が見た夢のキーワード：「${keyword}」

この夢のキーワードから、夢が象徴する意味を読み解いてください。
心理学的な観点と伝統的な夢占いの両方を織り交ぜて解釈してください。
夢が示す深層心理や、現在の生活との関連についても触れてください。
最後に前向きなアドバイスを添えてください。`;

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
    // ライフパスナンバーを計算
    const digits = birthDate.replace(/\D/g, "");
    let sum = 0;
    for (const d of digits) {
      sum += parseInt(d, 10);
    }
    // マスターナンバー（11, 22, 33）をチェックしながら1桁にする
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      let newSum = 0;
      while (sum > 0) {
        newSum += sum % 10;
        sum = Math.floor(sum / 10);
      }
      sum = newSum;
    }
    lifePathInfo = `生年月日：${birthDate}\nライフパスナンバー：${sum}`;
  }

  const systemInstruction = `あなたは親しみやすい占い師で、数秘術のスペシャリストです。
丁寧なですます口調で、相談者に寄り添うように話してください。
絵文字は使わないでください。マークダウン記法も使わないでください。
回答は300〜500文字程度にしてください。

${lifePathInfo}

ライフパスナンバーの意味を詳しく解説してください。
この数字が示す性格の特徴、人生の使命、才能について占い結果を伝えてください。
恋愛・仕事・人間関係について具体的なアドバイスも入れてください。
最後に前向きな一言を添えてください。`;

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

// ===== メインハンドラー =====

export async function POST(req: Request) {
  try {
    // レート制限チェック
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return Response.json(
        { error: "リクエストが多すぎます。しばらくしてからお試しください。" },
        {
          status: 429,
          headers: { "Retry-After": String(rateCheck.retryAfter) },
        },
      );
    }

    const body = await req.json();

    // バリデーション
    if (!body.type || !isValidFortuneType(body.type)) {
      return Response.json(
        { error: "占いの種類を指定してください。" },
        { status: 400 },
      );
    }

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
    };

    // Gemini APIが使えない場合はモックにフォールバック
    if (!ai) {
      const fallbackText = generateFallbackText(request);
      return new Response(createMockStream(fallbackText), {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // プロンプト構築
    let systemInstruction: string;
    let userMessage: string;

    switch (request.type) {
      case "tarot": {
        const prompt = buildTarotPrompt(request.question, request.messages, request.tarotTheme);
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
        const prompt = buildCompatibilityPrompt(request.question, request.person1, request.person2, request.messages);
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

    // Gemini APIストリーミング呼び出し
    try {
      const response = await ai.models.generateContentStream({
        model: MODEL,
        contents: userMessage,
        config: {
          systemInstruction,
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
          } catch {
            // ストリーミング中にエラーが発生した場合
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
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

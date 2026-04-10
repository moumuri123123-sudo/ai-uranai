const { GoogleGenAI } = require("@google/genai");
const { TwitterApi } = require("twitter-api-v2");

async function main() {
  // Geminiでお告げテキスト生成
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: "Asia/Tokyo",
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `今日は${today}です。「今日のお告げ」として、占い師の口調で今日の運勢メッセージを書いてください。`,
    config: {
      systemInstruction: `あなたは占処（うらないどころ）の占い師です。
毎朝Xに投稿する「今日のお告げ」を書いてください。

【ルール】
- 140文字以内（ハッシュタグ・URL除く）
- 絵文字は使わない
- マークダウンは使わない
- 具体的なアドバイスを1つ含める
- ラッキーカラーまたはラッキーアイテムを1つ含める
- 前向きで温かみのある口調
- 「今日のお告げ」で始める`,
    },
  });

  const fortuneText =
    response.text?.trim() || "今日も素敵な一日になりますように。";
  console.log("お告げ:", fortuneText);

  // 画像生成
  let imageBuffer = null;
  try {
    const themes = [
      "神秘的なタロットカードが光る祭壇、キャンドルの灯り、占いの館",
      "星空の下に浮かぶ水晶玉、紫と金色の光、神秘的な雰囲気",
      "満月と和風の鳥居、夜空に浮かぶ星座、幻想的な風景",
      "古い占いの書物とタロットカード、レトロな雰囲気、暖かい光",
      "夜空に広がる星座と流れ星、宇宙の神秘、深い藍色の空",
      "和風の提灯と桜、夜の神社、神秘的で美しい雰囲気",
      "朝焼けの空と水晶、新しい一日の始まり、希望の光",
    ];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const imgResponse = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: `${theme}、日本のレトロな占い館の雰囲気、高品質、美しい色彩`,
      config: {
        numberOfImages: 1,
        aspectRatio: "16:9",
        outputMimeType: "image/png",
      },
    });
    const imageBytes =
      imgResponse.generatedImages?.[0]?.image?.imageBytes;
    if (imageBytes) {
      imageBuffer = Buffer.from(imageBytes, "base64");
      console.log("画像生成成功");
    }
  } catch (e) {
    console.log("画像生成スキップ:", e.message);
  }

  // X投稿
  const twitter = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });

  const tweetText = `${fortuneText}

#占い #今日の運勢 #占処
https://uranaidokoro.com`;

  let tweetResult;
  if (imageBuffer) {
    const mediaId = await twitter.v1.uploadMedia(imageBuffer, {
      mimeType: "image/png",
    });
    tweetResult = await twitter.v2.tweet({
      text: tweetText,
      media: { media_ids: [mediaId] },
    });
  } else {
    tweetResult = await twitter.v2.tweet({ text: tweetText });
  }

  console.log("投稿成功! Tweet ID:", tweetResult.data.id);
}

main().catch((e) => {
  console.error("エラー:", e.message);
  process.exit(1);
});

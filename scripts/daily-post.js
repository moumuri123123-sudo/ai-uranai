const { GoogleGenAI } = require("@google/genai");
const { TwitterApi } = require("twitter-api-v2");

function getTodayZodiac() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const zodiacs = [
    { name: "やぎ座", period: "12/22-1/19" },
    { name: "みずがめ座", period: "1/20-2/18" },
    { name: "うお座", period: "2/19-3/20" },
    { name: "おひつじ座", period: "3/21-4/19" },
    { name: "おうし座", period: "4/20-5/20" },
    { name: "ふたご座", period: "5/21-6/21" },
    { name: "かに座", period: "6/22-7/22" },
    { name: "しし座", period: "7/23-8/22" },
    { name: "おとめ座", period: "8/23-9/22" },
    { name: "てんびん座", period: "9/23-10/23" },
    { name: "さそり座", period: "10/24-11/22" },
    { name: "いて座", period: "11/23-12/21" },
  ];
  const md = month * 100 + day;
  if (md >= 1222 || md <= 119) return zodiacs[0];
  if (md <= 218) return zodiacs[1];
  if (md <= 320) return zodiacs[2];
  if (md <= 419) return zodiacs[3];
  if (md <= 520) return zodiacs[4];
  if (md <= 621) return zodiacs[5];
  if (md <= 722) return zodiacs[6];
  if (md <= 822) return zodiacs[7];
  if (md <= 922) return zodiacs[8];
  if (md <= 1023) return zodiacs[9];
  if (md <= 1122) return zodiacs[10];
  return zodiacs[11];
}

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: "Asia/Tokyo",
  });
  const zodiac = getTodayZodiac();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `今日は${today}です。今日の星座は${zodiac.name}（${zodiac.period}）です。この星座の人に向けた、ひとこと星占いを書いてください。`,
    config: {
      systemInstruction: `あなたは占処（うらないどころ）の占い師です。
毎朝Xに投稿する「ひとこと星占い」を書いてください。

【ルール】
- 全体で140文字以内（ハッシュタグ・URL除く）
- 「○○座さん、」で始める（○○は今日の星座）
- 友達に話しかけるようなカジュアルで親しみやすい口調
- 絵文字は使わない
- マークダウンは使わない
- 具体的で実践しやすいアドバイスを1つ含める
- 前向きで元気が出る内容にする`,
    },
  });

  const fortuneText =
    response.text?.trim() || "おひつじ座さん、今日は直感を信じて。きっといいことがあるよ。";
  console.log("ひとこと星占い:", fortuneText);

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

#${zodiac.name} #今日の運勢 #占い #占処
https://uranaidokoro.com`;

  let tweetResult;
  try {
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
  } catch (e) {
    // 画像付きで失敗した場合、テキストのみで再試行
    if (imageBuffer) {
      console.log("画像付き投稿失敗、テキストのみで再試行:", e.message);
      tweetResult = await twitter.v2.tweet({ text: tweetText });
    } else {
      throw e;
    }
  }

  console.log("投稿成功! Tweet ID:", tweetResult.data.id);
}

main().catch((e) => {
  console.error("エラー:", e.message);
  process.exit(1);
});

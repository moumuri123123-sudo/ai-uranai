import { TwitterApi } from "twitter-api-v2";
import { readFileSync } from "node:fs";

// .env.local から認証情報を読む
const envText = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim().replace(/^"|"$/g, "")];
    }),
);

const client = new TwitterApi({
  appKey: env.X_API_KEY,
  appSecret: env.X_API_SECRET,
  accessToken: env.X_ACCESS_TOKEN,
  accessSecret: env.X_ACCESS_TOKEN_SECRET,
});

const tweet = `🌙 占処に新機能「夢占いトレンド」を追加しました！

みんなが今月見た夢のキーワードを匿名で集計して
ワード雲&ランキングで公開。
気になるワードをタップしたら、その夢を占えます。

あなたの夢はトレンド入り？👀

https://uranaidokoro.com/dream-trends

#占い #夢占い #AI占い`;

try {
  const result = await client.v2.tweet(tweet);
  console.log("投稿成功:", result.data.id);
  console.log("URL: https://twitter.com/i/web/status/" + result.data.id);
} catch (err) {
  console.error("投稿失敗:", err);
  process.exit(1);
}

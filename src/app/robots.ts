import type { MetadataRoute } from "next";

// AIクローラーは占処のコンテンツを引用可。/api/等の動的エンドポイントのみ除外し、
// ブログ・占い解説・FAQは明示的に許可する。
const AI_CRAWLERS = [
  "GPTBot",          // OpenAI ChatGPT
  "OAI-SearchBot",   // OpenAI SearchGPT
  "ChatGPT-User",    // ChatGPT 内ブラウザ
  "ClaudeBot",       // Anthropic Claude
  "Claude-Web",      // Anthropic Claude Web
  "anthropic-ai",    // Anthropic 旧UA
  "PerplexityBot",   // Perplexity AI
  "Perplexity-User", // Perplexity ユーザーブラウズ
  "Google-Extended", // Google Gemini / AI Overview
  "CCBot",           // Common Crawl（多数のLLM学習元）
  "cohere-ai",       // Cohere
  "Meta-ExternalAgent", // Meta AI
  "Applebot-Extended",  // Apple Intelligence
  "Bytespider",      // ByteDance / Doubao
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/share/", "/history/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
    ],
    sitemap: "https://uranaidokoro.com/sitemap.xml",
    host: "https://uranaidokoro.com",
  };
}

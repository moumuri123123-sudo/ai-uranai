import { blogArticles } from "@/lib/blog-data";

// publishedAtをパースし、無効ならフォールバック日付を返す
function safeParseDate(raw: string, fallback: Date, slug: string): Date {
  try {
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) {
      console.warn(`[feed.xml] 無効な日付: ${raw} (slug=${slug}) フォールバックを使用`);
      return fallback;
    }
    return parsed;
  } catch (e) {
    console.warn(`[feed.xml] 日付パース失敗: ${raw} (slug=${slug})`, e);
    return fallback;
  }
}

export async function GET() {
  const baseUrl = "https://uranaidokoro.com";
  const now = new Date();

  const sorted = [...blogArticles].sort(
    (a, b) =>
      safeParseDate(b.publishedAt, now, b.slug).getTime() -
      safeParseDate(a.publishedAt, now, a.slug).getTime()
  );

  const items = sorted
    .slice(0, 20)
    .map(
      (article) => `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/blog/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${article.slug}</guid>
      <description><![CDATA[${article.description}]]></description>
      <pubDate>${safeParseDate(article.publishedAt, now, article.slug).toUTCString()}</pubDate>
      <category>${article.category}</category>
    </item>`
    )
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>占処 ── AI占い コラム</title>
    <link>${baseUrl}/blog</link>
    <description>占いに関するコラム・豆知識をお届けします。タロット、星座、相性、MBTI、夢占い、数秘術など。</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

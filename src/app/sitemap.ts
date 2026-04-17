import type { MetadataRoute } from "next";
import { blogArticles } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://uranaidokoro.com";
  const lastUpdated = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: lastUpdated, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/tarot`, lastModified: lastUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/zodiac`, lastModified: lastUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/compatibility`, lastModified: lastUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/mbti`, lastModified: lastUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/dream`, lastModified: lastUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/numerology`, lastModified: lastUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/daily-ranking`, lastModified: lastUpdated, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/dream-trends`, lastModified: lastUpdated, changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: lastUpdated, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: lastUpdated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: lastUpdated, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: lastUpdated, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/privacy`, lastModified: lastUpdated, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/feed.xml`, lastModified: lastUpdated, changeFrequency: "weekly", priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}

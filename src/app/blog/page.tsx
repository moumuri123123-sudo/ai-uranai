import type { Metadata } from "next";
import Link from "next/link";
import { blogArticles } from "@/lib/blog-data";
import AdBanner from "@/components/AdBanner";
import FortuneIcon from "@/components/FortuneIcon";

export const metadata: Metadata = {
  title: "コラム",
  description:
    "占いに関するコラム記事。タロット、星座、相性、MBTIの知識を深める記事をお届けします。",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0408]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-mincho mb-3 text-2xl font-bold sm:text-3xl">
            <span className="text-gold animate-gold-pulse">コラム</span>
          </h1>
          <p className="text-sm text-muted">
            占いの知識を深める記事をお届けします
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {blogArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group"
            >
              <div className="card-mystical flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
                <div className="mb-3">
                  {article.category !== "general" ? (
                    <FortuneIcon type={article.category} size="md" />
                  ) : (
                    <FortuneIcon type="ai" size="md" />
                  )}
                </div>
                <h2 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-gold">
                  {article.title}
                </h2>
                <p className="mb-4 flex-1 text-sm text-muted">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">
                    {article.publishedAt}
                  </span>
                  <span className="text-sm text-gold/70 group-hover:text-gold">
                    読む &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <AdBanner slot="blog-1" />
      </div>
    </div>
  );
}

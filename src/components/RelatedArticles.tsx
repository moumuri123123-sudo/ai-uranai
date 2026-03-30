import Link from "next/link";
import { getArticlesByCategory } from "@/lib/blog-data";

type ThemeColor = {
  border: string;
  text: string;
  hoverBg: string;
  shadow: string;
};

const THEME_COLORS: Record<string, ThemeColor> = {
  tarot: {
    border: "border-[#ff2d55]/30",
    text: "text-[#ff2d55]",
    hoverBg: "hover:border-[#ff2d55]/50",
    shadow: "shadow-[#ff2d55]/10",
  },
  zodiac: {
    border: "border-[#ffd700]/30",
    text: "text-[#ffd700]",
    hoverBg: "hover:border-[#ffd700]/50",
    shadow: "shadow-[#ffd700]/10",
  },
  compatibility: {
    border: "border-[#ff69b4]/30",
    text: "text-[#ff69b4]",
    hoverBg: "hover:border-[#ff69b4]/50",
    shadow: "shadow-[#ff69b4]/10",
  },
  mbti: {
    border: "border-[#00ddff]/30",
    text: "text-[#00ddff]",
    hoverBg: "hover:border-[#00ddff]/50",
    shadow: "shadow-[#00ddff]/10",
  },
  dream: {
    border: "border-[#884898]/30",
    text: "text-[#884898]",
    hoverBg: "hover:border-[#884898]/50",
    shadow: "shadow-[#884898]/10",
  },
  numerology: {
    border: "border-[#f0a030]/30",
    text: "text-[#f0a030]",
    hoverBg: "hover:border-[#f0a030]/50",
    shadow: "shadow-[#f0a030]/10",
  },
};

interface RelatedArticlesProps {
  category: string;
}

export default function RelatedArticles({ category }: RelatedArticlesProps) {
  const articles = getArticlesByCategory(category, 3);
  const theme = THEME_COLORS[category] || THEME_COLORS.tarot;

  if (articles.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className={`font-mincho mb-6 text-center text-lg font-bold ${theme.text}`}>
        関連コラム
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className={`group block rounded-2xl border ${theme.border} bg-surface p-5 transition-all ${theme.hoverBg} hover:shadow-lg ${theme.shadow} active:scale-[0.98]`}
          >
            <div className="mb-2 font-yuji text-2xl">{article.emoji}</div>
            <h3 className="mb-2 text-sm font-bold leading-snug text-foreground/90 transition-colors group-hover:text-warm line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs leading-relaxed text-muted line-clamp-2">
              {article.description}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/blog"
          className={`inline-block text-sm ${theme.text} transition-opacity hover:opacity-80`}
        >
          もっと読む &rarr;
        </Link>
      </div>
    </section>
  );
}

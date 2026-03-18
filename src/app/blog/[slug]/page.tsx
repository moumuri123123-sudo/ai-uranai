import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogArticles, getArticleBySlug } from "@/lib/blog-data";
import AdBanner from "@/components/AdBanner";
import FortuneIcon from "@/components/FortuneIcon";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "記事が見つかりません" };
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: `${article.title} | 占処 AI占い`,
      description: article.description,
    },
  };
}

const categoryLinks: Record<string, { label: string; path: string }> = {
  tarot: { label: "タロット占いをする", path: "/tarot" },
  zodiac: { label: "星座占いをする", path: "/zodiac" },
  compatibility: { label: "相性占いをする", path: "/compatibility" },
  mbti: { label: "MBTI診断をする", path: "/mbti" },
  dream: { label: "夢占いをする", path: "/dream" },
  numerology: { label: "数秘術をする", path: "/numerology" },
  general: { label: "占いを始める", path: "/" },
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const link = categoryLinks[article.category];

  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          articleJsonLd({
            title: article.title,
            description: article.description,
            slug: article.slug,
            publishedAt: article.publishedAt,
            updatedAt: article.publishedAt,
          }),
          breadcrumbJsonLd([
            { name: "コラム", path: "/blog" },
            { name: article.title, path: `/blog/${article.slug}` },
          ]),
        ]) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-6 text-sm text-muted">
          <Link
            href="/blog"
            className="transition-colors hover:text-gold"
          >
            コラム
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground/70">{article.title}</span>
        </div>

        <article>
          <div className="mb-8 text-center">
            {article.category !== "general" ? (
              <FortuneIcon type={article.category} size="lg" />
            ) : (
              <FortuneIcon type="ai" size="lg" />
            )}
            <h1 className="font-mincho mt-4 text-2xl font-bold text-gold sm:text-3xl">
              {article.title}
            </h1>
            <p className="mt-3 text-sm text-muted">
              {article.publishedAt} 公開
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            {article.content.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="mb-4 text-sm leading-relaxed text-foreground/80 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link
            href={link.path}
            className="inline-block rounded-full border-2 border-gold bg-transparent px-6 py-2 text-sm text-gold transition-all hover:bg-gold/10"
          >
            {link.label} &rarr;
          </Link>
        </div>

        <AdBanner slot="blog-detail-1" />
      </div>
    </div>
  );
}

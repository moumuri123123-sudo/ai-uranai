import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogArticles, getArticleBySlug } from "@/lib/blog-data";
import AdBanner from "@/components/AdBanner";
import AffiliateCTA from "@/components/AffiliateCTA";
import FortuneIcon from "@/components/FortuneIcon";
import RelatedArticles from "@/components/RelatedArticles";
import { extractPlainText, renderArticleContent } from "@/lib/markdown";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

type Props = {
  params: Promise<{ slug: string }>;
};

type FortuneLink = {
  label: string;
  path: string;
  iconType: "tarot" | "zodiac" | "compatibility" | "mbti" | "dream" | "numerology";
  desc: string;
};

const FORTUNE_LINKS: FortuneLink[] = [
  { label: "タロット占い", path: "/tarot", iconType: "tarot", desc: "78枚のカードからあなたの運命を読み解く" },
  { label: "星座占い", path: "/zodiac", iconType: "zodiac", desc: "12星座それぞれの今日の運勢" },
  { label: "相性占い", path: "/compatibility", iconType: "compatibility", desc: "二人の相性をAIが鑑定" },
  { label: "MBTI診断", path: "/mbti", iconType: "mbti", desc: "16タイプの性格診断" },
  { label: "夢占い", path: "/dream", iconType: "dream", desc: "見た夢の深層心理を解釈" },
  { label: "数秘術", path: "/numerology", iconType: "numerology", desc: "生年月日に宿る運命の数字" },
];

const CATEGORY_FORTUNE_MAP: Record<string, string> = {
  tarot: "/tarot",
  zodiac: "/zodiac",
  compatibility: "/compatibility",
  mbti: "/mbti",
  dream: "/dream",
  numerology: "/numerology",
};

const CATEGORY_LINKS: Record<string, { label: string; path: string }> = {
  tarot: { label: "タロット占いをする", path: "/tarot" },
  zodiac: { label: "星座占いをする", path: "/zodiac" },
  compatibility: { label: "相性占いをする", path: "/compatibility" },
  mbti: { label: "MBTI診断をする", path: "/mbti" },
  dream: { label: "夢占いをする", path: "/dream" },
  numerology: { label: "数秘術をする", path: "/numerology" },
  general: { label: "占いを始める", path: "/" },
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
  // 記事ごとのOGPは同ディレクトリの opengraph-image.tsx で自動生成される。
  // JSON-LD や Twitter の明示画像URLとしてこのパスを指す。
  const articleOgImage = `https://uranaidokoro.com/blog/${article.slug}/opengraph-image`;
  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `https://uranaidokoro.com/blog/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: `${article.title} | 占処 AI占い`,
      description: article.description,
      url: `/blog/${article.slug}`,
      siteName: "占処 AI占い",
      locale: "ja_JP",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      // 明示指定しなくても opengraph-image.tsx が優先されるが、
      // Twitter と URL を揃えるため明示しておく。
      images: [
        {
          url: articleOgImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | 占処 AI占い`,
      description: article.description,
      images: [articleOgImage],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const categoryLink = CATEGORY_LINKS[article.category];
  const articleBodyText = extractPlainText(article.content, 1500);
  const articleOgImage = `https://uranaidokoro.com/blog/${article.slug}/opengraph-image`;

  const jsonLdPayload = JSON.stringify([
    articleJsonLd({
      title: article.title,
      description: article.description,
      slug: article.slug,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      image: articleOgImage,
      articleBody: articleBodyText,
      authorName: "占処AI編集部",
    }),
    breadcrumbJsonLd([
      { name: "コラム", path: "/blog" },
      { name: article.title, path: `/blog/${article.slug}` },
    ]),
  ]);

  // 「他の占いを試す」で、この記事のカテゴリ占いは除外
  const selfFortunePath = CATEGORY_FORTUNE_MAP[article.category];
  const otherFortunes = FORTUNE_LINKS.filter((f) => f.path !== selfFortunePath);

  return (
    <div className="min-h-screen bg-[#0a0408]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdPayload }}
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

          <div className="prose-like rounded-2xl border border-border bg-surface p-6 sm:p-8">
            {renderArticleContent(article.content)}
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link
            href={categoryLink.path}
            className="inline-block rounded-full border-2 border-gold bg-transparent px-6 py-2 text-sm text-gold transition-all hover:bg-gold/10"
          >
            {categoryLink.label} &rarr;
          </Link>
        </div>

        {/* 本文が十分な長さの記事のみに記事内広告を挿入（短い記事には詰め込まない） */}
        {article.content.length > 500 && (
          <AdBanner slot="blog-detail-inarticle" format="horizontal" />
        )}

        {/* アフィリエイト訴求（記事本文の直後、関連記事の手前） */}
        <AffiliateCTA fortuneType={article.category} variant="default" />

        <AdBanner slot="blog-detail-1" />

        {/* 関連コラム（同じカテゴリの記事） */}
        <RelatedArticles category={article.category} />

        {/* 他の占いを試す */}
        {otherFortunes.length > 0 && (
          <section className="mt-12">
            <h2 className="font-mincho mb-6 text-center text-lg font-bold text-gold">
              他の占いを試す
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {otherFortunes.map((f) => (
                <Link
                  key={f.path}
                  href={f.path}
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-surface/80 p-4 transition-all hover:border-gold/50 hover:bg-surface"
                >
                  <FortuneIcon type={f.iconType} size="sm" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-foreground/90 transition-colors group-hover:text-gold">
                      {f.label}
                    </div>
                    <div className="text-xs text-muted">{f.desc}</div>
                  </div>
                  <span className="text-sm text-gold/60 group-hover:text-gold">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-block text-sm text-muted transition-colors hover:text-gold"
          >
            &larr; コラム一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

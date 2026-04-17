const BASE_URL = "https://uranaidokoro.com";
const SITE_NAME = "占処 AI占い";
const SITE_SHORT_NAME = "占処";
const LOGO_URL = `${BASE_URL}/icon-192.png`;
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const DEFAULT_AUTHOR_NAME = "占処AI編集部";

const publisherOrganization = {
  "@type": "Organization",
  name: SITE_NAME,
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
  },
};

const articlePublisherOrganization = {
  "@type": "Organization",
  name: SITE_SHORT_NAME,
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 192,
    height: 192,
  },
};

const defaultArticleAuthor = {
  "@type": "Organization",
  name: DEFAULT_AUTHOR_NAME,
  url: BASE_URL,
};

export const DEFAULT_BLOG_OG_IMAGE = DEFAULT_OG_IMAGE;

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    description:
      "最先端のAIが、古来の占術であなたの運命を紡ぎます。タロット・星座・相性・MBTI®・夢占い・数秘術。",
    inLanguage: "ja",
    publisher: publisherOrganization,
  };
}

export function webApplicationJsonLd(params: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: params.name,
    description: params.description,
    url: `${BASE_URL}${params.path}`,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
    inLanguage: "ja",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: BASE_URL,
    },
    publisher: publisherOrganization,
  };
}

export function articleJsonLd(params: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  image?: string;
  articleBody?: string;
  authorName?: string;
}) {
  const articleUrl = `${BASE_URL}/blog/${params.slug}`;
  const imageUrl = params.image ?? DEFAULT_OG_IMAGE;
  const author = {
    ...defaultArticleAuthor,
    name: params.authorName ?? DEFAULT_AUTHOR_NAME,
  };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: articleUrl,
    datePublished: params.publishedAt,
    dateModified: params.updatedAt,
    inLanguage: "ja-JP",
    image: {
      "@type": "ImageObject",
      url: imageUrl,
    },
    author,
    publisher: articlePublisherOrganization,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(params.articleBody ? { articleBody: params.articleBody } : {}),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}

export function rankingJsonLd(params: {
  month: number;
  day: number;
  rankings: { name: string; rank: number }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `今日の星座占いランキング【${params.month}月${params.day}日】`,
    description: `12星座の${params.month}月${params.day}日の運勢ランキング。1位から12位まで、詳細運勢とラッキーアイテムも掲載。`,
    url: `${BASE_URL}/daily-ranking`,
    numberOfItems: params.rankings.length,
    itemListOrder: "ItemListOrderAscending",
    inLanguage: "ja",
    itemListElement: params.rankings.map((z) => ({
      "@type": "ListItem",
      position: z.rank,
      name: z.name,
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "トップ",
        item: BASE_URL,
      },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${BASE_URL}${item.path}`,
      })),
    ],
  };
}

import { Metadata } from 'next';
import Link from 'next/link';
import {
  fortuneTypeNames,
  fortuneTypeIcons,
  getFortuneTypePath,
  parseShareParams,
} from '@/lib/share-utils';
import FortuneIcon from '@/components/FortuneIcon';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const data = parseShareParams(params);

  if (!data) {
    return { title: '占処 AI占い', robots: { index: false, follow: false } };
  }

  const typeName = fortuneTypeNames[data.fortuneType];
  const title = `${typeName}結果 - ${data.label}`;
  const description = data.summary || `${typeName}の結果をAI占い師がお伝えします。`;

  const ogParams = new URLSearchParams({
    type: data.fortuneType,
    label: data.label,
    summary: data.summary,
  });
  const ogImageUrl = `/api/og-result?${ogParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    robots: { index: false, follow: false },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams;
  const data = parseShareParams(params);

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0408] px-4">
        <p className="text-muted mb-6">このリンクは無効です</p>
        <Link
          href="/"
          className="border-neon-red text-neon-red hover:bg-neon-red/10 rounded-full border-2 px-8 py-3 text-sm font-semibold transition-all"
        >
          トップページへ
        </Link>
      </div>
    );
  }

  const typeName = fortuneTypeNames[data.fortuneType];
  const icon = fortuneTypeIcons[data.fortuneType];
  const targetPath = getFortuneTypePath(data.fortuneType);

  const iconTypeMap: Record<
    string,
    'tarot' | 'zodiac' | 'compatibility' | 'mbti' | 'dream' | 'numerology'
  > = {
    札: 'tarot',
    星: 'zodiac',
    縁: 'compatibility',
    心: 'mbti',
    夢: 'dream',
    数: 'numerology',
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0408] px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* アイコン */}
        <div className="flex justify-center">
          <FortuneIcon type={iconTypeMap[icon] || 'tarot'} size="lg" />
        </div>

        {/* 占いタイプ */}
        <p className="text-muted text-sm">{typeName}の結果</p>

        {/* メインラベル */}
        <h1 className="text-gold font-mincho animate-gold-pulse text-3xl font-bold">
          {data.label}
        </h1>

        {/* 要約 */}
        {data.summary && (
          <p className="text-foreground/80 px-4 text-sm leading-relaxed">{data.summary}</p>
        )}

        {/* 装飾ライン */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="bg-neon-red/30 h-px w-16" />
          <span className="text-gold/50 text-sm">&#x2726;</span>
          <div className="bg-neon-red/30 h-px w-16" />
        </div>

        {/* CTAボタン */}
        <Link
          href={targetPath}
          className="border-neon-red text-neon-red hover:bg-neon-red/10 hover:shadow-neon-red/20 inline-block rounded-full border-2 px-8 py-3 text-sm font-semibold transition-all hover:shadow-lg"
        >
          自分も占ってみる
        </Link>

        <p className="text-muted pt-4 text-xs">占処 ── AI占い師</p>
      </div>
    </div>
  );
}

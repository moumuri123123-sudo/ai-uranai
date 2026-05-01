import type { Metadata } from 'next';
import Link from 'next/link';
import { redis } from '@/lib/redis';
import { breadcrumbJsonLd, webApplicationJsonLd } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';

export const revalidate = 1800; // 30分ごと再生成

function getJstMonthKey(): string {
  const d = new Date();
  const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function formatJstMonthLabel(key: string): string {
  const [y, m] = key.split('-');
  return `${y}年${Number(m)}月`;
}

async function getTopWords(month: string): Promise<{ word: string; count: number }[]> {
  if (!redis) return [];
  try {
    const result = await redis.zrange<string[]>(`dream:words:${month}`, 0, 49, {
      rev: true,
      withScores: true,
    });
    const words: { word: string; count: number }[] = [];
    for (let i = 0; i < result.length; i += 2) {
      const w = String(result[i]);
      const c = Number(result[i + 1]);
      if (w && Number.isFinite(c)) words.push({ word: w, count: c });
    }
    return words;
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: '夢占いトレンド ── 今月みんなが見た夢ランキング',
  description:
    '占処で占われた夢のキーワードを匿名集計。今月、みんなが見ている夢は？恋愛・仕事・不安を映す夢の傾向をチェックできます。',
  alternates: { canonical: 'https://uranaidokoro.com/dream-trends' },
  openGraph: {
    title: '夢占いトレンド | 占処 AI占い',
    description: '今月みんなが見た夢のキーワードランキング。夢占いトレンドをチェック。',
    type: 'website',
  },
};

export default async function DreamTrendsPage() {
  const month = getJstMonthKey();
  const words = await getTopWords(month);
  const monthLabel = formatJstMonthLabel(month);
  const maxCount = words[0]?.count ?? 1;

  // 出現回数に応じてフォントサイズを動的調整（クラス名）
  const sizeFor = (count: number) => {
    const ratio = count / maxCount;
    if (ratio >= 0.8) return 'text-3xl sm:text-4xl text-gold';
    if (ratio >= 0.5) return 'text-2xl sm:text-3xl text-neon-red';
    if (ratio >= 0.3) return 'text-xl sm:text-2xl text-warm';
    if (ratio >= 0.15) return 'text-lg text-foreground/80';
    return 'text-sm text-muted';
  };

  return (
    <div className="bg-[#0a0408] px-4 py-12 sm:py-16">
      <JsonLd
        id="dream-trends-ld"
        data={[
          webApplicationJsonLd({
            name: '夢占いトレンド',
            description: '占処で占われた夢のキーワードを匿名集計したトレンドページ。',
            path: '/dream-trends',
          }),
          breadcrumbJsonLd([{ name: '夢占いトレンド', path: '/dream-trends' }]),
        ]}
      />
      <div className="mx-auto max-w-4xl">
        <h1 className="font-mincho text-gold mb-2 text-center text-2xl font-bold sm:text-3xl">
          夢占いトレンド
        </h1>
        <p className="text-muted mb-10 text-center text-sm">
          {monthLabel}に占処で占われた夢のキーワードランキング
        </p>

        {words.length === 0 ? (
          <div className="border-border bg-surface rounded-xl border p-8 text-center">
            <p className="text-muted text-sm">今月はまだデータが集まっていません。</p>
            <Link
              href="/dream"
              className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 mt-4 inline-block rounded-full border px-6 py-2 text-sm font-semibold transition-colors"
            >
              夢占いを試す
            </Link>
          </div>
        ) : (
          <>
            {/* ワード雲 */}
            <section
              aria-label={`${monthLabel}の夢キーワード`}
              className="border-border bg-surface/40 mb-12 rounded-2xl border p-6 sm:p-10"
            >
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
                {words.map((w) => (
                  <Link
                    key={w.word}
                    href={`/dream?q=${encodeURIComponent(w.word)}`}
                    className={`font-mincho inline-block transition-opacity hover:opacity-70 ${sizeFor(w.count)}`}
                    aria-label={`「${w.word}」で夢占いする（今月${w.count}回）`}
                  >
                    {w.word}
                  </Link>
                ))}
              </div>
            </section>

            {/* ランキング表 */}
            <section
              aria-label="夢キーワードランキング"
              className="border-border bg-surface/20 rounded-xl border p-6"
            >
              <h2 className="font-mincho text-gold mb-4 text-center text-lg font-semibold">
                TOP {Math.min(words.length, 20)}
              </h2>
              <ol className="space-y-2">
                {words.slice(0, 20).map((w, i) => (
                  <li
                    key={w.word}
                    className="border-border/50 flex items-center justify-between rounded-lg border bg-[#0a0408] px-4 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mincho text-gold w-8 text-center text-lg"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <Link
                        href={`/dream?q=${encodeURIComponent(w.word)}`}
                        className="text-foreground hover:text-gold font-semibold transition-colors"
                      >
                        {w.word}
                      </Link>
                    </div>
                    <span className="text-muted text-sm">{w.count.toLocaleString()}件</span>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}

        <div className="border-border/50 bg-surface/20 text-muted mt-10 rounded-xl border p-5 text-xs leading-relaxed">
          <p className="text-foreground/80 mb-2 font-semibold">このデータについて</p>
          <p>
            占処の夢占い機能に入力されたキーワードを匿名で集計しています。
            個人を特定できる情報は一切保存していません。
            集計対象は日本語の特徴語（2〜10文字）のみで、ありふれた助詞等は除外されています。
          </p>
        </div>
      </div>
    </div>
  );
}

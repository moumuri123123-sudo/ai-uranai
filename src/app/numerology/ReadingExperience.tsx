'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ShareButtons from '@/components/ShareButtons';
import AffiliateCTA from '@/components/AffiliateCTA';
import NextFortuneCTA from '@/components/NextFortuneCTA';
import { calculateLifePath } from '@/lib/numerology';

// ChatBoxはchatフェーズでのみ使用する重量コンポーネント。初期ロードを軽くするため動的インポート。
const ChatBox = dynamic(() => import('@/components/ChatBox'), {
  ssr: false,
  loading: () => (
    <div
      className="border-neon-amber/30 bg-surface mx-auto my-6 h-24 w-full max-w-2xl animate-pulse rounded-2xl border"
      aria-label="チャットを読み込み中"
    />
  ),
});

const lifePathMeanings: Record<number, string> = {
  1: 'リーダーシップと独立心の数字。先駆者としての使命を持っています。',
  2: '調和と協力の数字。人と人をつなぐ架け橋となる使命を持っています。',
  3: '創造性と表現力の数字。芸術的才能で周囲を明るくする使命を持っています。',
  4: '安定と努力の数字。堅実な基盤を築く使命を持っています。',
  5: '自由と変化の数字。冒険心で人生を切り開く使命を持っています。',
  6: '愛と責任の数字。家庭や地域を守り育てる使命を持っています。',
  7: '探求と知恵の数字。真理を追い求める使命を持っています。',
  8: '豊かさと達成の数字。物質的・精神的な成功を収める使命を持っています。',
  9: '博愛と完成の数字。人類への奉仕と癒しの使命を持っています。',
  11: 'マスターナンバー。直感力とスピリチュアルな導きの使命を持っています。',
  22: 'マスターナンバー。壮大なビジョンを現実にする使命を持っています。',
  33: 'マスターナンバー。無償の愛で世界を照らす使命を持っています。',
};

type Props = {
  relatedArticles: React.ReactNode;
};

export default function ReadingExperience({ relatedArticles }: Props) {
  const [phase, setPhase] = useState<'input' | 'chat'>('input');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [lifePathNumber, setLifePathNumber] = useState<number | null>(null);
  const [birthDateStr, setBirthDateStr] = useState('');
  const [resultSummary, setResultSummary] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSubmit = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    if (!y || !m || !d) return;

    const isoBirthDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const num = calculateLifePath(isoBirthDate);
    setLifePathNumber(num);
    setBirthDateStr(`${y}年${m}月${d}日`);
    setPhase('chat');
  };

  const meaning = lifePathNumber ? lifePathMeanings[lifePathNumber] : '';

  return (
    <>
      {/* 入力フェーズ */}
      {phase === 'input' && (
        <div className="mx-auto max-w-sm space-y-8">
          <fieldset>
            <legend className="text-warm mb-3 block w-full text-center text-sm">
              生年月日を入力してください
            </legend>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex min-w-0 items-center gap-1">
                <label htmlFor="birth-year" className="sr-only">
                  生年
                </label>
                <select
                  id="birth-year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="border-border bg-surface text-foreground focus:border-neon-amber/50 min-w-0 flex-1 rounded-xl border px-2 py-3 text-sm transition-colors outline-none"
                >
                  <option value="">年</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className="text-muted text-xs" aria-hidden="true">
                  年
                </span>
              </div>

              <div className="flex min-w-0 items-center gap-1">
                <label htmlFor="birth-month" className="sr-only">
                  生月
                </label>
                <select
                  id="birth-month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="border-border bg-surface text-foreground focus:border-neon-amber/50 min-w-0 flex-1 rounded-xl border px-2 py-3 text-sm transition-colors outline-none"
                >
                  <option value="">月</option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <span className="text-muted text-xs" aria-hidden="true">
                  月
                </span>
              </div>

              <div className="flex min-w-0 items-center gap-1">
                <label htmlFor="birth-day" className="sr-only">
                  生日
                </label>
                <select
                  id="birth-day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="border-border bg-surface text-foreground focus:border-neon-amber/50 min-w-0 flex-1 rounded-xl border px-2 py-3 text-sm transition-colors outline-none"
                >
                  <option value="">日</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <span className="text-muted text-xs" aria-hidden="true">
                  日
                </span>
              </div>
            </div>
          </fieldset>

          <div className="text-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!year || !month || !day}
              className="border-neon-amber text-neon-amber hover:bg-neon-amber/10 hover:shadow-neon-amber/20 min-h-11 rounded-full border-2 px-8 py-3 text-sm font-semibold transition-all hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            >
              鑑定する
            </button>
          </div>
        </div>
      )}

      {/* チャットフェーズ */}
      {phase === 'chat' && lifePathNumber !== null && (
        <div>
          {/* ライフパスナンバー表示 */}
          <div className="border-neon-amber/30 bg-surface shadow-neon-amber/10 mx-auto mb-8 max-w-sm rounded-2xl border p-6 text-center shadow-lg">
            <p className="text-muted mb-1 text-xs">{birthDateStr}</p>
            <p className="text-muted mb-1 text-xs">あなたのライフパスナンバー</p>
            <p className="text-gold animate-gold-pulse my-3 text-5xl font-bold">{lifePathNumber}</p>
            {lifePathNumber >= 11 && (
              <p className="text-neon-amber mb-2 text-xs font-semibold">Master Number</p>
            )}
            <p className="text-foreground/80 text-sm">{meaning}</p>
          </div>

          <ChatBox
            fortuneType="numerology"
            birthDate={`${year}-${String(parseInt(month, 10)).padStart(2, '0')}-${String(parseInt(day, 10)).padStart(2, '0')}`}
            historyLabel={`数秘術 - ライフパスナンバー${lifePathNumber}`}
            initialMessage={`${birthDateStr}生まれのあなたのライフパスナンバーは「${lifePathNumber}」です。\n\n${meaning}\n\nそれでは鑑定に入りますね...`}
            autoStart
            onFirstResponse={(text) => setResultSummary(text.slice(0, 80))}
            afterContent={<NextFortuneCTA currentFortune="numerology" />}
          />
          <ShareButtons
            title="数秘術結果"
            resultData={
              resultSummary
                ? {
                    fortuneType: 'numerology',
                    label: `ライフパスナンバー ${lifePathNumber}`,
                    summary: resultSummary,
                  }
                : undefined
            }
          />

          <AffiliateCTA fortuneType="numerology" />

          <button
            type="button"
            onClick={() => {
              setPhase('input');
              setYear('');
              setMonth('');
              setDay('');
              setLifePathNumber(null);
              setResultSummary('');
            }}
            className="text-muted hover:text-warm mx-auto mt-4 block text-sm transition-colors"
          >
            &#x2190; 別の日付で鑑定する
          </button>
        </div>
      )}

      {/* 関連コラム（入力フェーズのみ） */}
      {phase === 'input' && relatedArticles}
    </>
  );
}

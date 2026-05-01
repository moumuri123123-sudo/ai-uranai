'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ShareButtons from '@/components/ShareButtons';
import AffiliateCTA from '@/components/AffiliateCTA';
import NextFortuneCTA from '@/components/NextFortuneCTA';

// ChatBoxはchatフェーズでのみ使用する重量コンポーネント。初期ロードを軽くするため動的インポート。
const ChatBox = dynamic(() => import('@/components/ChatBox'), {
  ssr: false,
  loading: () => (
    <div
      className="border-neon-pink/30 bg-surface mx-auto my-6 h-24 w-full max-w-2xl animate-pulse rounded-2xl border"
      aria-label="チャットを読み込み中"
    />
  ),
});

type Phase = 'input' | 'chat';

const STORAGE_KEY = 'compatibility-state';
const STORAGE_TTL_MS = 60 * 60 * 1000; // 1時間

type SavedState = {
  person1: string;
  person2: string;
  submittedNames: { p1: string; p2: string };
  compatibilityScore: number | null;
  phase: Phase;
  savedAt: number;
};

type Props = {
  relatedArticles: React.ReactNode;
};

export default function ReadingExperience({ relatedArticles }: Props) {
  const [phase, setPhase] = useState<Phase>('input');
  const [person1, setPerson1] = useState('');
  const [person2, setPerson2] = useState('');
  const [submittedNames, setSubmittedNames] = useState({ p1: '', p2: '' });
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [resultSummary, setResultSummary] = useState('');

  // ===== マウント時: sessionStorageから復元 =====
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedState;
      if (!saved || typeof saved.savedAt !== 'number') return;
      if (Date.now() - saved.savedAt > STORAGE_TTL_MS) {
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      if (saved.phase === 'chat' && saved.submittedNames?.p1 && saved.submittedNames?.p2) {
        // sessionStorageからの復元はクライアント専用。SSR差異を避けるためマウント後に一括反映
        /* eslint-disable react-hooks/set-state-in-effect */
        setPerson1(saved.person1);
        setPerson2(saved.person2);
        setSubmittedNames(saved.submittedNames);
        setCompatibilityScore(saved.compatibilityScore);
        setPhase('chat');
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      // ignore
    }
  }, []);

  // ===== chat フェーズでsessionStorageに保存 =====
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      if (phase === 'chat' && submittedNames.p1 && submittedNames.p2) {
        const toSave: SavedState = {
          person1,
          person2,
          submittedNames,
          compatibilityScore,
          phase,
          savedAt: Date.now(),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      }
    } catch {
      // ignore
    }
  }, [phase, person1, person2, submittedNames, compatibilityScore]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const p1 = person1.trim() || 'あなた';
    const p2 = person2.trim() || 'お相手';
    // 相性度はここで1回だけ生成し、以降のチャットAPI呼び出しに同じ値を渡して一貫性を保つ
    setCompatibilityScore(Math.floor(Math.random() * 41) + 60);
    setSubmittedNames({ p1, p2 });
    setPhase('chat');
  };

  const handleBackToInput = () => {
    setPhase('input');
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* 名前入力フェーズ */}
      {phase === 'input' && (
        <div className="mx-auto max-w-md">
          <form onSubmit={handleStart}>
            <div className="border-border bg-surface rounded-2xl border p-6 shadow-lg">
              {/* 1人目 */}
              <div className="mb-5">
                <label htmlFor="person1" className="text-warm mb-2 block text-sm font-medium">
                  1人目の名前
                </label>
                <input
                  id="person1"
                  type="text"
                  value={person1}
                  onChange={(e) => setPerson1(e.target.value)}
                  placeholder="あなたの名前（ニックネーム可）"
                  className="border-border text-foreground placeholder-muted/60 focus:border-neon-pink/50 focus:ring-neon-pink/30 w-full rounded-xl border bg-[#0a0408] px-4 py-2.5 text-sm transition-colors focus:ring-1 focus:outline-none"
                />
              </div>

              {/* ハートの装飾 */}
              <div className="my-4 flex items-center justify-center" aria-hidden="true">
                <div className="bg-border h-px flex-1" />
                <span className="font-yuji text-neon-pink mx-4 animate-pulse text-2xl">縁</span>
                <div className="bg-border h-px flex-1" />
              </div>

              {/* 2人目 */}
              <div className="mb-6">
                <label htmlFor="person2" className="text-warm mb-2 block text-sm font-medium">
                  2人目の名前
                </label>
                <input
                  id="person2"
                  type="text"
                  value={person2}
                  onChange={(e) => setPerson2(e.target.value)}
                  placeholder="相手の名前（ニックネーム可）"
                  className="border-border text-foreground placeholder-muted/60 focus:border-neon-pink/50 focus:ring-neon-pink/30 w-full rounded-xl border bg-[#0a0408] px-4 py-2.5 text-sm transition-colors focus:ring-1 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="border-neon-pink text-neon-pink hover:bg-neon-pink/10 hover:shadow-neon-pink/20 w-full rounded-full border-2 bg-transparent px-6 py-3 text-sm font-semibold transition-all hover:shadow-lg active:scale-95"
              >
                相性を占う
              </button>
            </div>

            <p className="text-muted mt-4 text-center text-xs">名前を入力しなくても占えます</p>
          </form>
        </div>
      )}

      {/* チャットフェーズ */}
      {phase === 'chat' && (
        <div>
          <div className="border-neon-pink/30 bg-surface shadow-neon-pink/10 mx-auto mb-8 max-w-sm rounded-2xl border p-6 text-center shadow-lg">
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-muted text-xs">1人目</p>
                <p className="text-gold text-lg font-bold">{submittedNames.p1}</p>
              </div>
              <span className="font-yuji text-neon-pink text-2xl" aria-hidden="true">
                縁
              </span>
              <div>
                <p className="text-muted text-xs">2人目</p>
                <p className="text-gold text-lg font-bold">{submittedNames.p2}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleBackToInput}
              className="text-warm hover:text-gold mt-3 text-xs underline underline-offset-2 transition-colors"
            >
              名前を変更する
            </button>
          </div>

          <ChatBox
            fortuneType="compatibility"
            person1={submittedNames.p1}
            person2={submittedNames.p2}
            compatibilityScore={compatibilityScore ?? undefined}
            historyLabel={`相性占い - ${submittedNames.p1} & ${submittedNames.p2}`}
            initialMessage={`${submittedNames.p1}さんと${submittedNames.p2}さんの相性占いですね。\n\nそれでは鑑定に入りますね...`}
            autoStart
            onFirstResponse={(text) => setResultSummary(text.slice(0, 80))}
            afterContent={<NextFortuneCTA currentFortune="compatibility" />}
          />
          <ShareButtons
            title="相性占い結果"
            resultData={
              resultSummary
                ? {
                    fortuneType: 'compatibility',
                    label: `${submittedNames.p1} & ${submittedNames.p2}`,
                    summary: resultSummary,
                  }
                : undefined
            }
          />

          <AffiliateCTA fortuneType="compatibility" />
        </div>
      )}
      {/* 関連コラム（入力フェーズのみ） */}
      {phase === 'input' && relatedArticles}
    </>
  );
}

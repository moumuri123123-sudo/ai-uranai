'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import ShareButtons from '@/components/ShareButtons';
import AffiliateCTA from '@/components/AffiliateCTA';
import NextFortuneCTA from '@/components/NextFortuneCTA';

// ChatBoxはchatフェーズでのみ使用する重量コンポーネント。初期ロードを軽くするため動的インポート。
const ChatBox = dynamic(() => import('@/components/ChatBox'), {
  ssr: false,
  loading: () => (
    <div
      className="border-neon-purple/30 bg-surface mx-auto my-6 h-24 w-full max-w-2xl animate-pulse rounded-2xl border"
      aria-label="チャットを読み込み中"
    />
  ),
});

type Props = {
  relatedArticles: React.ReactNode;
};

export default function ReadingExperience({ relatedArticles }: Props) {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<'input' | 'chat'>('input');
  // URLの ?q= は外部リンクからの初期キーワード。マウント時に1度だけ反映する（以降はユーザー編集を優先）
  const [keyword, setKeyword] = useState(() => {
    const q = searchParams.get('q');
    return q && q.trim() ? q.trim().slice(0, 100) : '';
  });
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [resultSummary, setResultSummary] = useState('');

  const quickDreams = [
    '空を飛ぶ夢',
    '落ちる夢',
    '追いかけられる夢',
    '海の夢',
    '亡くなった人の夢',
    '歯が抜ける夢',
    '遅刻する夢',
    '蛇の夢',
  ];

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmittedKeyword(trimmed);
    setPhase('chat');
    // 匿名ワード雲のために特徴語のみ集計に送信（原文は送らず、キーワード抽出のみ）
    fetch('/api/dream-words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: trimmed }),
    }).catch(() => {
      // 記録失敗はユーザー体験に影響しないので無視
    });
  };

  return (
    <>
      {/* 入力フェーズ */}
      {phase === 'input' && (
        <div className="mx-auto max-w-md space-y-8">
          {/* テキスト入力 */}
          <div>
            <label htmlFor="dream-keyword" className="text-warm mb-2 block text-sm">
              夢の内容やキーワードを入力してください
            </label>
            <div className="flex gap-3">
              <input
                id="dream-keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit(keyword);
                }}
                placeholder="例: 海で泳いでいた"
                maxLength={100}
                className="border-border bg-surface text-foreground placeholder:text-muted/50 focus:border-neon-purple/50 flex-1 rounded-xl border px-4 py-3 text-sm transition-colors outline-none"
              />
              <button
                type="button"
                onClick={() => handleSubmit(keyword)}
                disabled={!keyword.trim()}
                className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 min-h-11 rounded-xl border-2 px-6 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-30"
              >
                占う
              </button>
            </div>
          </div>

          {/* クイック選択 */}
          <div>
            <p className="text-muted mb-3 text-center text-xs">よく見る夢から選ぶ</p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickDreams.map((dream) => (
                <button
                  key={dream}
                  type="button"
                  onClick={() => handleSubmit(dream)}
                  className="border-border bg-surface text-foreground/80 hover:border-neon-purple/40 hover:bg-surface-hover hover:text-neon-purple min-h-11 rounded-full border px-4 py-2 text-xs transition-all"
                >
                  {dream}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* チャットフェーズ */}
      {phase === 'chat' && submittedKeyword && (
        <div>
          <div className="border-neon-purple/30 bg-surface shadow-neon-purple/10 mx-auto mb-8 max-w-sm rounded-2xl border p-6 text-center shadow-lg">
            <p className="text-muted mb-1 text-xs">あなたが見た夢</p>
            <p className="text-gold text-xl font-bold">{submittedKeyword}</p>
          </div>

          <ChatBox
            fortuneType="dream"
            dreamKeyword={submittedKeyword}
            historyLabel={`夢占い - ${submittedKeyword}`}
            initialMessage={`あなたが見た夢は「${submittedKeyword}」ですね。\n\nそれでは鑑定に入りますね...`}
            autoStart
            onFirstResponse={(text) => setResultSummary(text.slice(0, 80))}
            afterContent={<NextFortuneCTA currentFortune="dream" />}
          />
          <ShareButtons
            title="夢占い結果"
            resultData={
              resultSummary
                ? {
                    fortuneType: 'dream',
                    label: submittedKeyword,
                    summary: resultSummary,
                  }
                : undefined
            }
          />

          <AffiliateCTA fortuneType="dream" />

          <button
            type="button"
            onClick={() => {
              setPhase('input');
              setKeyword('');
              setSubmittedKeyword('');
              setResultSummary('');
            }}
            className="text-muted hover:text-warm mx-auto mt-4 block text-sm transition-colors"
          >
            &#x2190; 別の夢を占う
          </button>
        </div>
      )}

      {/* 関連コラム（入力フェーズのみ） */}
      {phase === 'input' && relatedArticles}
    </>
  );
}

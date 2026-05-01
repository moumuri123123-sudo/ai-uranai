'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ShareButtons from '@/components/ShareButtons';
import AffiliateCTA from '@/components/AffiliateCTA';
import NextFortuneCTA from '@/components/NextFortuneCTA';
import { mbtiTypes, mbtiQuestions } from '@/lib/fortune-data';

// ChatBoxはchatフェーズでのみ使用する重量コンポーネント。初期ロードを軽くするため動的インポート。
const ChatBox = dynamic(() => import('@/components/ChatBox'), {
  ssr: false,
  loading: () => (
    <div
      className="border-neon-cyan/30 bg-surface mx-auto my-6 h-24 w-full max-w-2xl animate-pulse rounded-2xl border"
      aria-label="チャットを読み込み中"
    />
  ),
});

type Phase = 'select' | 'quiz' | 'chat';

type Props = {
  relatedArticles: React.ReactNode;
};

export default function ReadingExperience({ relatedArticles }: Props) {
  const [phase, setPhase] = useState<Phase>('select');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<('A' | 'B')[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [resultSummary, setResultSummary] = useState('');

  function calculateMbtiType(ans: ('A' | 'B')[]): string {
    const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };

    ans.forEach((a, i) => {
      const q = mbtiQuestions[i];
      if (a === 'A') {
        scores[q.axis]++;
      }
    });

    const axisCount: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
    mbtiQuestions.forEach((q) => {
      axisCount[q.axis]++;
    });

    const e = scores.EI > axisCount.EI / 2 ? 'E' : 'I';
    const s = scores.SN > axisCount.SN / 2 ? 'S' : 'N';
    const t = scores.TF > axisCount.TF / 2 ? 'T' : 'F';
    const j = scores.JP > axisCount.JP / 2 ? 'J' : 'P';

    return `${e}${s}${t}${j}`;
  }

  function handleAnswer(choice: 'A' | 'B') {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < mbtiQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const type = calculateMbtiType(newAnswers);
      setSelectedType(type);
      setPhase('chat');
    }
  }

  function handleSelectType(typeCode: string) {
    setSelectedType(typeCode);
    setPhase('chat');
  }

  const typeGroups = [
    { label: '分析家', codes: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] },
    { label: '外交官', codes: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] },
    { label: '番人', codes: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] },
    { label: '探検家', codes: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] },
  ];

  const typeData = selectedType ? mbtiTypes[selectedType] : null;

  return (
    <>
      {/* ===== フェーズ: select ===== */}
      {phase === 'select' && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPhase('quiz')}
              className="group border-border bg-surface hover:border-neon-cyan/40 hover:shadow-neon-cyan/10 rounded-2xl border p-8 text-left transition-all hover:shadow-lg"
            >
              <div className="font-yuji text-neon-cyan mb-3 text-3xl" aria-hidden="true">
                問
              </div>
              <h3 className="text-neon-cyan mb-2 text-lg font-bold transition-colors group-hover:brightness-125">
                診断する
              </h3>
              <p className="text-muted text-sm">
                10個の質問に答えて、あなたのMBTIタイプを診断します
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('type-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group border-border bg-surface hover:border-gold/40 hover:shadow-gold/10 rounded-2xl border p-8 text-left transition-all hover:shadow-lg"
            >
              <div className="font-yuji text-gold mb-3 text-3xl" aria-hidden="true">
                選
              </div>
              <h3 className="text-gold mb-2 text-lg font-bold transition-colors group-hover:brightness-125">
                タイプを選ぶ
              </h3>
              <p className="text-muted text-sm">自分のMBTIタイプを知っている方はこちら</p>
            </button>
          </div>

          {/* 16タイプのグリッド */}
          <div id="type-grid" className="space-y-6">
            <h2 className="font-yuji text-warm text-center text-lg">16タイプから選ぶ</h2>
            {typeGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-gold mb-3 text-sm font-semibold">{group.label}</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {group.codes.map((code) => {
                    const t = mbtiTypes[code];
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelectType(code)}
                        className="group border-border bg-surface hover:border-neon-cyan/40 hover:bg-surface-hover min-h-11 rounded-xl border p-4 text-left transition-all"
                      >
                        <div className="text-neon-cyan mb-1 text-sm font-bold transition-colors group-hover:brightness-125">
                          {t.code}
                        </div>
                        <div className="text-muted text-xs">{t.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== フェーズ: quiz ===== */}
      {phase === 'quiz' && (
        <div className="mx-auto max-w-lg">
          {/* 進捗バー */}
          <div className="mb-6">
            <div className="text-muted mb-2 flex justify-between text-xs">
              <span>
                質問 {currentQuestion + 1} / {mbtiQuestions.length}
              </span>
              <span>{Math.round((currentQuestion / mbtiQuestions.length) * 100)}%</span>
            </div>
            <div
              className="bg-surface h-2 overflow-hidden rounded-full"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={mbtiQuestions.length}
              aria-valuenow={currentQuestion}
              aria-label="診断進捗"
            >
              <div
                className="from-neon-red to-gold h-full rounded-full bg-gradient-to-r transition-all duration-500"
                style={{ width: `${(currentQuestion / mbtiQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 質問 */}
          <div className="border-border bg-surface rounded-2xl border p-8">
            <h2 className="text-foreground mb-8 text-center text-lg font-bold">
              {mbtiQuestions[currentQuestion].question}
            </h2>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleAnswer('A')}
                className="border-border hover:border-neon-red/50 hover:bg-surface-hover min-h-11 w-full rounded-xl border bg-[#0a0408] px-6 py-4 text-left text-sm transition-all"
              >
                <span
                  className="bg-neon-red/20 text-neon-red mr-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold"
                  aria-hidden="true"
                >
                  A
                </span>
                {mbtiQuestions[currentQuestion].choiceA}
              </button>
              <button
                type="button"
                onClick={() => handleAnswer('B')}
                className="border-border hover:border-gold/50 hover:bg-surface-hover min-h-11 w-full rounded-xl border bg-[#0a0408] px-6 py-4 text-left text-sm transition-all"
              >
                <span
                  className="bg-gold/20 text-gold mr-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold"
                  aria-hidden="true"
                >
                  B
                </span>
                {mbtiQuestions[currentQuestion].choiceB}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
                setAnswers(answers.slice(0, -1));
              } else {
                setPhase('select');
                setAnswers([]);
                setCurrentQuestion(0);
              }
            }}
            className="text-muted hover:text-warm mt-4 text-sm transition-colors"
          >
            &#x2190; {currentQuestion > 0 ? '前の質問に戻る' : '選択画面に戻る'}
          </button>
        </div>
      )}

      {/* ===== フェーズ: chat ===== */}
      {phase === 'chat' && selectedType && typeData && (
        <div className="space-y-6">
          {/* 判定結果 */}
          <div className="border-gold/30 bg-surface shadow-gold/10 rounded-2xl border p-6 text-center shadow-lg">
            <p className="text-muted mb-1 text-sm">あなたのタイプ</p>
            <h2 className="text-gold animate-gold-pulse mb-1 text-3xl font-bold">
              {typeData.code}
            </h2>
            <p className="text-neon-cyan mb-3 text-lg font-semibold">{typeData.name}</p>
            <p className="text-muted text-sm">{typeData.traits}</p>
            <div className="text-muted mt-3 text-xs">
              相性の良いタイプ:{' '}
              {typeData.compatibleTypes.map((c) => `${c}（${mbtiTypes[c]?.name}）`).join('、')}
            </div>
          </div>

          <ChatBox
            fortuneType="mbti"
            mbtiType={selectedType}
            historyLabel={`MBTI診断 - ${typeData.code}（${typeData.name}）`}
            initialMessage={`あなたのMBTIタイプは ${typeData.code}（${typeData.name}）ですね！\n\n${typeData.traits}という特徴があります。\n\nそれでは鑑定に入りますね...`}
            autoStart
            onFirstResponse={(text) => setResultSummary(text.slice(0, 80))}
            afterContent={<NextFortuneCTA currentFortune="mbti" />}
          />
          <ShareButtons
            title="MBTI診断結果"
            resultData={
              resultSummary
                ? {
                    fortuneType: 'mbti',
                    label: `${typeData.code} ${typeData.name}`,
                    summary: resultSummary,
                  }
                : undefined
            }
          />

          <AffiliateCTA fortuneType="mbti" />

          <button
            type="button"
            onClick={() => {
              setPhase('select');
              setSelectedType(null);
              setAnswers([]);
              setCurrentQuestion(0);
            }}
            className="text-muted hover:text-warm mx-auto block text-sm transition-colors"
          >
            &#x2190; 最初からやり直す
          </button>
        </div>
      )}

      {/* 関連コラム（選択フェーズのみ） */}
      {phase === 'select' && relatedArticles}
    </>
  );
}

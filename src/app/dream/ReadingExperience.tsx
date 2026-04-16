"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import ShareButtons from "@/components/ShareButtons";

type Props = {
  relatedArticles: React.ReactNode;
};

export default function ReadingExperience({ relatedArticles }: Props) {
  const [phase, setPhase] = useState<"input" | "chat">("input");
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [resultSummary, setResultSummary] = useState("");

  const quickDreams = [
    "空を飛ぶ夢",
    "落ちる夢",
    "追いかけられる夢",
    "海の夢",
    "亡くなった人の夢",
    "歯が抜ける夢",
    "遅刻する夢",
    "蛇の夢",
  ];

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmittedKeyword(trimmed);
    setPhase("chat");
  };

  return (
    <>
      {/* 入力フェーズ */}
      {phase === "input" && (
        <div className="mx-auto max-w-md space-y-8">
          {/* テキスト入力 */}
          <div>
            <label className="mb-2 block text-sm text-warm">
              夢の内容やキーワードを入力してください
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit(keyword);
                }}
                placeholder="例: 海で泳いでいた"
                maxLength={100}
                className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-colors focus:border-neon-purple/50"
              />
              <button
                onClick={() => handleSubmit(keyword)}
                disabled={!keyword.trim()}
                className="rounded-xl border-2 border-neon-purple px-6 py-3 text-sm font-semibold text-neon-purple transition-all hover:bg-neon-purple/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                占う
              </button>
            </div>
          </div>

          {/* クイック選択 */}
          <div>
            <p className="mb-3 text-center text-xs text-muted">
              よく見る夢から選ぶ
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickDreams.map((dream) => (
                <button
                  key={dream}
                  onClick={() => handleSubmit(dream)}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-xs text-foreground/80 transition-all hover:border-neon-purple/40 hover:bg-surface-hover hover:text-neon-purple"
                >
                  {dream}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* チャットフェーズ */}
      {phase === "chat" && submittedKeyword && (
        <div>
          <div className="mx-auto mb-8 max-w-sm rounded-2xl border border-neon-purple/30 bg-surface p-6 text-center shadow-lg shadow-neon-purple/10">
            <p className="mb-1 text-xs text-muted">あなたが見た夢</p>
            <p className="text-xl font-bold text-gold">
              {submittedKeyword}
            </p>
          </div>

          <ChatBox
            fortuneType="dream"
            dreamKeyword={submittedKeyword}
            historyLabel={`夢占い - ${submittedKeyword}`}
            initialMessage={`あなたが見た夢は「${submittedKeyword}」ですね。\n\nそれでは鑑定に入りますね...`}
            autoStart
            onFirstResponse={(text) => setResultSummary(text.slice(0, 80))}
          />
          <ShareButtons
            title="夢占い結果"
            resultData={resultSummary ? {
              fortuneType: "dream",
              label: submittedKeyword,
              summary: resultSummary,
            } : undefined}
          />

          <button
            onClick={() => {
              setPhase("input");
              setKeyword("");
              setSubmittedKeyword("");
              setResultSummary("");
            }}
            className="mx-auto mt-4 block text-sm text-muted hover:text-warm transition-colors"
          >
            &#x2190; 別の夢を占う
          </button>
        </div>
      )}

      {/* 関連コラム（入力フェーズのみ） */}
      {phase === "input" && relatedArticles}
    </>
  );
}

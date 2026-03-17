"use client";

import { useState } from "react";
import ChatBox from "@/components/ChatBox";
import AdBanner from "@/components/AdBanner";
import ShareButtons from "@/components/ShareButtons";
import { mbtiTypes, mbtiQuestions } from "@/lib/fortune-data";

type Phase = "select" | "quiz" | "chat";

export default function MbtiPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<("A" | "B")[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  function calculateMbtiType(ans: ("A" | "B")[]): string {
    const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };

    ans.forEach((a, i) => {
      const q = mbtiQuestions[i];
      if (a === "A") {
        scores[q.axis]++;
      }
    });

    const axisCount: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
    mbtiQuestions.forEach((q) => {
      axisCount[q.axis]++;
    });

    const e = scores.EI > axisCount.EI / 2 ? "E" : "I";
    const s = scores.SN > axisCount.SN / 2 ? "S" : "N";
    const t = scores.TF > axisCount.TF / 2 ? "T" : "F";
    const j = scores.JP > axisCount.JP / 2 ? "J" : "P";

    return `${e}${s}${t}${j}`;
  }

  function handleAnswer(choice: "A" | "B") {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < mbtiQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const type = calculateMbtiType(newAnswers);
      setSelectedType(type);
      setPhase("chat");
    }
  }

  function handleSelectType(typeCode: string) {
    setSelectedType(typeCode);
    setPhase("chat");
  }

  const typeGroups = [
    { label: "分析家", codes: ["INTJ", "INTP", "ENTJ", "ENTP"] },
    { label: "外交官", codes: ["INFJ", "INFP", "ENFJ", "ENFP"] },
    { label: "番人", codes: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"] },
    { label: "探検家", codes: ["ISTP", "ISFP", "ESTP", "ESFP"] },
  ];

  const typeData = selectedType ? mbtiTypes[selectedType] : null;

  return (
    <div className="min-h-screen bg-[#0a0408]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* タイトル */}
        <div className="mb-10 text-center">
          <div className="mb-4 text-5xl">&#x1F9E0;</div>
          <h1 className="font-mincho mb-2 text-2xl font-bold sm:text-3xl">
            <span className="text-neon-cyan" style={{ textShadow: "0 0 12px rgba(0,221,255,0.4)" }}>
              MBTI性格診断
            </span>
          </h1>
          <p className="text-sm text-muted">
            あなたの性格タイプをAIが分析してアドバイスします
          </p>
        </div>

        {/* ===== フェーズ: select ===== */}
        {phase === "select" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setPhase("quiz")}
                className="group rounded-2xl border border-border bg-surface p-8 text-left transition-all hover:border-neon-cyan/40 hover:shadow-lg hover:shadow-neon-cyan/10"
              >
                <div className="mb-3 text-3xl">&#x1F4DD;</div>
                <h3 className="mb-2 text-lg font-bold text-neon-cyan transition-colors group-hover:brightness-125">
                  診断する
                </h3>
                <p className="text-sm text-muted">
                  10個の質問に答えて、あなたのMBTIタイプを診断します
                </p>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("type-grid");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="group rounded-2xl border border-border bg-surface p-8 text-left transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10"
              >
                <div className="mb-3 text-3xl">&#x1F3AF;</div>
                <h3 className="mb-2 text-lg font-bold text-gold transition-colors group-hover:brightness-125">
                  タイプを選ぶ
                </h3>
                <p className="text-sm text-muted">
                  自分のMBTIタイプを知っている方はこちら
                </p>
              </button>
            </div>

            {/* 16タイプのグリッド */}
            <div id="type-grid" className="space-y-6">
              <h2 className="font-yuji text-center text-lg text-warm">
                16タイプから選ぶ
              </h2>
              {typeGroups.map((group) => (
                <div key={group.label}>
                  <h3 className="mb-3 text-sm font-semibold text-gold">
                    {group.label}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {group.codes.map((code) => {
                      const t = mbtiTypes[code];
                      return (
                        <button
                          key={code}
                          onClick={() => handleSelectType(code)}
                          className="group rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-neon-cyan/40 hover:bg-surface-hover"
                        >
                          <div className="mb-1 text-sm font-bold text-neon-cyan transition-colors group-hover:brightness-125">
                            {t.code}
                          </div>
                          <div className="text-xs text-muted">{t.name}</div>
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
        {phase === "quiz" && (
          <div className="mx-auto max-w-lg">
            {/* 進捗バー */}
            <div className="mb-6">
              <div className="mb-2 flex justify-between text-xs text-muted">
                <span>質問 {currentQuestion + 1} / {mbtiQuestions.length}</span>
                <span>{Math.round(((currentQuestion) / mbtiQuestions.length) * 100)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-red to-gold transition-all duration-500"
                  style={{ width: `${(currentQuestion / mbtiQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* 質問 */}
            <div className="rounded-2xl border border-border bg-surface p-8">
              <h2 className="mb-8 text-center text-lg font-bold text-foreground">
                {mbtiQuestions[currentQuestion].question}
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleAnswer("A")}
                  className="w-full rounded-xl border border-border bg-[#0a0408] px-6 py-4 text-left text-sm transition-all hover:border-neon-red/50 hover:bg-surface-hover"
                >
                  <span className="mr-3 inline-block rounded-full bg-neon-red/20 px-2.5 py-0.5 text-xs font-bold text-neon-red">
                    A
                  </span>
                  {mbtiQuestions[currentQuestion].choiceA}
                </button>
                <button
                  onClick={() => handleAnswer("B")}
                  className="w-full rounded-xl border border-border bg-[#0a0408] px-6 py-4 text-left text-sm transition-all hover:border-gold/50 hover:bg-surface-hover"
                >
                  <span className="mr-3 inline-block rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-gold">
                    B
                  </span>
                  {mbtiQuestions[currentQuestion].choiceB}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                  setAnswers(answers.slice(0, -1));
                } else {
                  setPhase("select");
                  setAnswers([]);
                  setCurrentQuestion(0);
                }
              }}
              className="mt-4 text-sm text-muted hover:text-warm transition-colors"
            >
              &#x2190; {currentQuestion > 0 ? "前の質問に戻る" : "選択画面に戻る"}
            </button>
          </div>
        )}

        {/* ===== フェーズ: chat ===== */}
        {phase === "chat" && selectedType && typeData && (
          <div className="space-y-6">
            {/* 判定結果 */}
            <div className="rounded-2xl border border-gold/30 bg-surface p-6 text-center shadow-lg shadow-gold/10">
              <p className="mb-1 text-sm text-muted">あなたのタイプ</p>
              <h2 className="mb-1 text-3xl font-bold text-gold animate-gold-pulse">{typeData.code}</h2>
              <p className="mb-3 text-lg font-semibold text-neon-cyan">{typeData.name}</p>
              <p className="text-sm text-muted">{typeData.traits}</p>
              <div className="mt-3 text-xs text-muted">
                相性の良いタイプ: {typeData.compatibleTypes.map(c => `${c}（${mbtiTypes[c]?.name}）`).join("、")}
              </div>
            </div>

            <ChatBox
              fortuneType="mbti"
              mbtiType={selectedType}
              historyLabel={`MBTI診断 - ${typeData.code}（${typeData.name}）`}
              initialMessage={`あなたのMBTIタイプは ${typeData.code}（${typeData.name}）だね！\n\n${typeData.traits}っていう特徴があるよ。\n\n何でも聞いてね！恋愛、仕事、人間関係...${typeData.code}タイプの視点からアドバイスするよ。`}
            />
            <ShareButtons title="MBTI診断結果" />

            <button
              onClick={() => {
                setPhase("select");
                setSelectedType(null);
                setAnswers([]);
                setCurrentQuestion(0);
              }}
              className="mx-auto block text-sm text-muted hover:text-warm transition-colors"
            >
              &#x2190; 最初からやり直す
            </button>
          </div>
        )}

        {/* 注意書き */}
        <div className="mt-12 rounded-xl border border-border bg-surface/30 px-6 py-4">
          <p className="text-xs leading-relaxed text-muted/70">
            ※ この診断は簡易的なものであり、公式のMBTI診断ではありません。MBTI（Myers-Briggs Type Indicator）はThe Myers-Briggs Companyの商標です。正式な診断は認定プラクティショナーのもとで受けることをおすすめします。本診断はエンターテインメント目的であり、結果を過度に信頼しないようご注意ください。
          </p>
        </div>
        {/* 広告 */}
        <AdBanner slot="mbti-1" />
      </div>
    </div>
  );
}

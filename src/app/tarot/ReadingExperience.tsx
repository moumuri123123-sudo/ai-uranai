"use client";

import { useState, useEffect, useCallback } from "react";
import ChatBox from "@/components/ChatBox";
import ShareButtons from "@/components/ShareButtons";
import FortuneIcon from "@/components/FortuneIcon";
import AffiliateCTA from "@/components/AffiliateCTA";
import { tarotCardNames } from "@/lib/fortune-data.client";

const CARD_BACK = "占";

type DrawnCard = {
  name: string;
  reversed: boolean;
  position: string;
};

type Phase = "intro" | "question" | "spread" | "shuffle" | "draw" | "reading";
type SpreadType = "one" | "three";

const THEMES = [
  { key: "総合運", icon: "運" },
  { key: "恋愛運", icon: "恋" },
  { key: "仕事運", icon: "業" },
  { key: "金運", icon: "財" },
  { key: "人間関係", icon: "縁" },
  { key: "健康運", icon: "体" },
];

const STORAGE_KEY = "tarot-state";
const STORAGE_TTL_MS = 60 * 60 * 1000; // 1時間

type SavedState = {
  drawnCards: DrawnCard[];
  spreadType: SpreadType;
  selectedTheme: string | null;
  userQuestion: string;
  phase: Phase;
  savedAt: number;
};

type Props = {
  relatedArticles: React.ReactNode;
};

export default function ReadingExperience({ relatedArticles }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [spreadType, setSpreadType] = useState<SpreadType>("one");
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [resultSummary, setResultSummary] = useState("");

  // ===== マウント時: sessionStorageから復元 =====
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedState;
      if (!saved || typeof saved.savedAt !== "number") return;
      if (Date.now() - saved.savedAt > STORAGE_TTL_MS) {
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      if (saved.phase === "reading" && saved.drawnCards?.length > 0) {
        setDrawnCards(saved.drawnCards);
        setSpreadType(saved.spreadType);
        setSelectedTheme(saved.selectedTheme);
        setUserQuestion(saved.userQuestion);
        setFlippedIndices(saved.drawnCards.map((_, i) => i));
        setPhase("reading");
      }
    } catch {
      // ignore
    }
  }, []);

  // ===== reading フェーズでsessionStorageに保存 =====
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (phase === "reading" && drawnCards.length > 0) {
        const toSave: SavedState = {
          drawnCards,
          spreadType,
          selectedTheme,
          userQuestion,
          phase,
          savedAt: Date.now(),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      }
    } catch {
      // ignore
    }
  }, [phase, drawnCards, spreadType, selectedTheme, userQuestion]);

  // ===== シャッフル → カード引きへ自動遷移 =====
  useEffect(() => {
    if (phase !== "shuffle") return;
    const timer = setTimeout(() => {
      const count = spreadType === "three" ? 3 : 1;
      const positions = spreadType === "three" ? ["過去", "現在", "未来"] : [""];
      const drawn: DrawnCard[] = [];
      const usedIndices = new Set<number>();

      for (let i = 0; i < count; i++) {
        let idx: number;
        do {
          idx = Math.floor(Math.random() * tarotCardNames.length);
        } while (usedIndices.has(idx));
        usedIndices.add(idx);
        drawn.push({
          name: tarotCardNames[idx],
          reversed: Math.random() < 0.35,
          position: positions[i],
        });
      }

      setDrawnCards(drawn);
      setFlippedIndices([]);
      setPhase("draw");
    }, 3000);
    return () => clearTimeout(timer);
  }, [phase, spreadType]);

  // ===== カードを1枚ずつめくる =====
  const flipCard = useCallback((index: number) => {
    setFlippedIndices((prev) => {
      if (prev.includes(index)) return prev;
      return [...prev, index];
    });
  }, []);

  // 全カードめくったらリーディングへ
  useEffect(() => {
    if (phase !== "draw" || drawnCards.length === 0) return;
    if (flippedIndices.length === drawnCards.length) {
      const timer = setTimeout(() => setPhase("reading"), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, flippedIndices, drawnCards]);

  // ===== リセット =====
  const resetAll = () => {
    setPhase("intro");
    setSelectedTheme(null);
    setUserQuestion("");
    setSpreadType("one");
    setDrawnCards([]);
    setFlippedIndices([]);
    setResultSummary("");
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  };

  // 履歴ラベル
  const historyLabel = drawnCards.length > 0
    ? spreadType === "three"
      ? `タロット占い（スリーカード） - ${drawnCards.map(c => `${c.name}${c.reversed ? "逆" : "正"}`).join(" / ")}${selectedTheme ? ` (${selectedTheme})` : ""}`
      : `タロット占い - ${drawnCards[0].name} ${drawnCards[0].reversed ? "逆位置" : "正位置"}${selectedTheme ? ` (${selectedTheme})` : ""}`
    : "";

  return (
    <>
      {/* ===== 1. 心を落ち着ける ===== */}
      {phase === "intro" && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
          <div className="mb-6"><FortuneIcon type="tarot" size="lg" /></div>
          <h1 className="font-mincho mb-4 text-2xl font-bold sm:text-3xl">
            <span className="text-neon-red animate-neon-pulse">タロット占い</span>
          </h1>
          <div className="mx-auto max-w-sm space-y-4">
            <p className="text-sm leading-relaxed text-warm">
              タロットカードが、あなたの過去・現在・未来を映し出します。
            </p>
            <p className="text-sm leading-relaxed text-muted">
              まずは深呼吸をして、心を落ち着けましょう。
              <br />
              占いたいことを思い浮かべながら、準備ができたら始めてください。
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setPhase("question")}
                className="min-h-11 rounded-full border-2 border-neon-red bg-transparent px-10 py-3 text-sm font-semibold text-neon-red transition-all hover:bg-neon-red/10 hover:shadow-lg hover:shadow-neon-red/20 active:scale-95"
              >
                占いを始める
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 2. 質問の設定 ===== */}
      {phase === "question" && (
        <div className="mx-auto max-w-lg animate-fade-in">
          <div className="mb-4 text-center">
            <div className="mb-3"><FortuneIcon type="tarot" size="lg" /></div>
            <h2 className="font-mincho mb-2 text-xl font-bold text-warm sm:text-2xl">
              占いたいことを教えてください
            </h2>
            <p className="text-xs text-muted">
              心に浮かぶ悩みや聞きたいことを、自由に入力してください
            </p>
          </div>

          {/* テーマ選択（任意） */}
          <div className="mb-6">
            <p className="mb-3 text-center text-xs text-muted">テーマを選ぶ（任意）</p>
            <div className="flex flex-wrap justify-center gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.key}
                  type="button"
                  onClick={() => setSelectedTheme(selectedTheme === theme.key ? null : theme.key)}
                  aria-pressed={selectedTheme === theme.key}
                  className={`flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-xs transition-all active:scale-95 ${
                    selectedTheme === theme.key
                      ? "border-neon-red bg-neon-red/10 text-neon-red"
                      : "border-border bg-surface text-muted hover:border-neon-red/30 hover:text-warm"
                  }`}
                >
                  <span className="font-yuji" aria-hidden="true">{theme.icon}</span>
                  {theme.key}
                </button>
              ))}
            </div>
          </div>

          {/* 自由記述 */}
          <div className="mb-6">
            <label htmlFor="tarot-question" className="sr-only">質問を入力</label>
            <textarea
              id="tarot-question"
              value={userQuestion}
              onChange={(e) => {
                if (e.target.value.length <= 200) setUserQuestion(e.target.value);
              }}
              placeholder="例：転職を考えているのですが、今動くべきでしょうか..."
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder-muted/50 focus:border-neon-red/50 focus:outline-none focus:ring-1 focus:ring-neon-red/30 transition-colors"
            />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>具体的な悩みがあるほど深い鑑定ができます</span>
              {userQuestion.length > 150 && (
                <span className={userQuestion.length >= 200 ? "text-neon-red" : ""}>{userQuestion.length}/200</span>
              )}
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setPhase("spread")}
              className="min-h-11 rounded-full border-2 border-neon-red bg-transparent px-10 py-3 text-sm font-semibold text-neon-red transition-all hover:bg-neon-red/10 hover:shadow-lg hover:shadow-neon-red/20 active:scale-95"
            >
              次へ
            </button>
            <button
              type="button"
              onClick={() => setPhase("intro")}
              className="mt-3 block mx-auto text-xs text-muted hover:text-warm transition-colors"
            >
              <span aria-hidden="true">&#x2190;</span> 戻る
            </button>
          </div>
        </div>
      )}

      {/* ===== 3. スプレッド選択 ===== */}
      {phase === "spread" && (
        <div className="mx-auto max-w-lg animate-fade-in">
          <div className="mb-6 text-center">
            <h2 className="font-mincho mb-2 text-xl font-bold text-warm sm:text-2xl">
              展開法を選んでください
            </h2>
            <p className="text-xs text-muted">
              カードの枚数と読み方が変わります
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* ワンオラクル */}
            <button
              type="button"
              onClick={() => { setSpreadType("one"); setPhase("shuffle"); }}
              className="group rounded-2xl border border-border bg-surface p-6 text-left transition-all hover:border-neon-red/50 hover:shadow-lg hover:shadow-neon-red/10 active:scale-[0.98]"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-9 items-center justify-center rounded-lg border border-neon-red/30 bg-[#0a0408] font-yuji text-lg text-neon-red" aria-hidden="true">
                  {CARD_BACK}
                </div>
                <div>
                  <p className="font-mincho text-base font-bold text-foreground">ワンオラクル</p>
                  <p className="text-xs text-gold">1枚引き</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted">
                シンプルで直感的な1枚引き。今のあなたへのメッセージを端的に伝えてくれます。迷ったときや、今日のアドバイスが欲しいときに。
              </p>
            </button>

            {/* スリーカード */}
            <button
              type="button"
              onClick={() => { setSpreadType("three"); setPhase("shuffle"); }}
              className="group rounded-2xl border border-border bg-surface p-6 text-left transition-all hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10 active:scale-[0.98]"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex gap-1" aria-hidden="true">
                  {[0,1,2].map(i => (
                    <div key={i} className="flex h-12 w-7 items-center justify-center rounded-md border border-gold/30 bg-[#0a0408] font-yuji text-sm text-gold">
                      {CARD_BACK}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-mincho text-base font-bold text-foreground">スリーカード</p>
                  <p className="text-xs text-gold">過去・現在・未来</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted">
                3枚のカードで時間の流れを読みます。過去の影響、現在の状況、そして未来の展望を物語として読み解きます。
              </p>
            </button>
          </div>

          {/* 選んだ内容の表示 */}
          {(selectedTheme || userQuestion) && (
            <div className="mt-6 rounded-xl border border-border bg-surface/50 p-4">
              {selectedTheme && (
                <p className="text-xs text-muted">テーマ: <span className="text-neon-red">{selectedTheme}</span></p>
              )}
              {userQuestion && (
                <p className="mt-1 text-xs text-muted">悩み: <span className="text-warm">{userQuestion}</span></p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setPhase("question")}
            className="mt-4 block mx-auto text-xs text-muted hover:text-warm transition-colors"
          >
            <span aria-hidden="true">&#x2190;</span> 質問を変更する
          </button>
        </div>
      )}

      {/* ===== 4. シャッフル演出 ===== */}
      {phase === "shuffle" && (
        <div
          className="flex min-h-[50vh] flex-col items-center justify-center animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <p className="mb-8 font-mincho text-sm text-warm">
            心の中で悩みを念じながら...
          </p>
          <div className="relative flex items-center justify-center gap-3" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-16 rounded-lg border border-neon-red/40 bg-surface shadow-lg animate-shuffle sm:h-32 sm:w-20"
                style={{
                  ["--shuffle-x" as string]: `${(i - 3) * 15}px`,
                  ["--shuffle-y" as string]: `${Math.sin(i) * 20}px`,
                  ["--shuffle-r" as string]: `${(i - 3) * 5}deg`,
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                <div className="flex h-full w-full items-center justify-center font-yuji text-2xl text-neon-red/40 sm:text-3xl">
                  {CARD_BACK}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted animate-pulse">
            カードをシャッフルしています...
          </p>
        </div>
      )}

      {/* ===== 5. カードを引く + フリップ ===== */}
      {phase === "draw" && drawnCards.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
          <p className="mb-8 font-mincho text-sm text-warm">
            {spreadType === "three" ? "カードをクリックして1枚ずつめくってください" : "カードをクリックしてめくってください"}
          </p>

          <div className={`flex items-end justify-center ${spreadType === "three" ? "gap-4 sm:gap-6" : ""}`}>
            {drawnCards.map((card, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* ポジションラベル（スリーカード） */}
                {spreadType === "three" && (
                  <p className="mb-2 text-xs font-medium text-gold">{card.position}</p>
                )}

                <button
                  type="button"
                  aria-label={`カード${i + 1}${spreadType === "three" ? `(${card.position})` : ""}をめくる`}
                  aria-pressed={flippedIndices.includes(i)}
                  onClick={() => flipCard(i)}
                  className={`${spreadType === "three" ? "card-flip-container-sm" : "card-flip-container"} border-0 bg-transparent p-0`}
                >
                  <div className={`card-flip-inner ${flippedIndices.includes(i) ? "flipped" : ""}`}>
                    {/* 裏面（占の文字） */}
                    <div className="card-flip-front border-2 border-neon-red/50 bg-surface shadow-2xl shadow-neon-red/20 hover:border-neon-red hover:shadow-neon-red/40 transition-all" aria-hidden="true">
                      <div className="flex h-full w-full items-center justify-center font-yuji text-3xl text-neon-red/60 sm:text-4xl">
                        {CARD_BACK}
                      </div>
                    </div>
                    {/* 表面（カード名 + 正逆） */}
                    <div className="card-flip-back border-2 border-gold/50 bg-surface shadow-2xl shadow-gold/20">
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-2">
                        <p className={`font-yuji text-gold ${spreadType === "three" ? "text-sm sm:text-base" : "text-lg sm:text-xl"}`}>
                          {card.name}
                        </p>
                        <p className="text-[10px] text-neon-red sm:text-xs">
                          {card.reversed ? "逆位置" : "正位置"}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* グロー効果 */}
          <div className="mt-4 h-4 w-32 rounded-full bg-gold/10 blur-xl" />

          {flippedIndices.length === drawnCards.length && (
            <p className="mt-6 text-sm text-neon-red animate-pulse">
              カードが出揃いました。リーディングに入ります...
            </p>
          )}
          {flippedIndices.length < drawnCards.length && (
            <p className="mt-6 text-xs text-muted">
              {drawnCards.length - flippedIndices.length}枚のカードが残っています
            </p>
          )}
        </div>
      )}

      {/* ===== 6. リーディング + チャット ===== */}
      {phase === "reading" && drawnCards.length > 0 && (
        <div className="animate-fade-in">
          {/* カード情報表示 */}
          <div className="mx-auto mb-8 max-w-md rounded-2xl border border-neon-red/30 bg-surface p-5 shadow-lg shadow-neon-red/10">
            <p className="mb-3 text-center text-xs text-muted">
              {spreadType === "three" ? "スリーカード（過去・現在・未来）" : "ワンオラクル"}
            </p>
            {spreadType === "three" ? (
              <div className="grid grid-cols-3 gap-3">
                {drawnCards.map((card, i) => (
                  <div key={i} className="text-center">
                    <p className="mb-1 text-[10px] font-medium text-gold">{card.position}</p>
                    <p className="text-sm font-bold text-foreground">{card.name}</p>
                    <p className="text-[10px] text-neon-red">{card.reversed ? "逆位置" : "正位置"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-2xl font-bold text-gold">{drawnCards[0].name}</p>
                <p className="mt-1 text-sm text-neon-red">{drawnCards[0].reversed ? "逆位置" : "正位置"}</p>
              </div>
            )}
            {selectedTheme && (
              <p className="mt-3 text-center text-xs text-muted">テーマ: {selectedTheme}</p>
            )}
            {userQuestion && (
              <p className="mt-1 text-center text-xs text-muted">&ldquo;{userQuestion}&rdquo;</p>
            )}
          </div>

          <ChatBox
            fortuneType="tarot"
            tarotTheme={selectedTheme || undefined}
            tarotCard={spreadType === "one" ? drawnCards[0].name : undefined}
            tarotReversed={spreadType === "one" ? drawnCards[0].reversed : undefined}
            tarotCards={spreadType === "three" ? drawnCards : undefined}
            tarotSpread={spreadType}
            tarotQuestion={userQuestion || undefined}
            historyLabel={historyLabel}
            autoStart
            onFirstResponse={(text) => setResultSummary(text.slice(0, 80))}
          />
          <ShareButtons
            title="タロット占い結果"
            resultData={resultSummary ? {
              fortuneType: "tarot",
              label: spreadType === "three"
                ? drawnCards.map(c => `${c.name}${c.reversed ? "(逆)" : ""}`).join(" / ")
                : `${drawnCards[0].name} ${drawnCards[0].reversed ? "逆位置" : "正位置"}`,
              summary: resultSummary,
            } : undefined}
          />

          <AffiliateCTA fortuneType="tarot" />

          <button
            type="button"
            onClick={resetAll}
            className="mx-auto mt-4 block text-sm text-muted hover:text-warm transition-colors"
          >
            <span aria-hidden="true">&#x2190;</span> もう一度占う
          </button>
        </div>
      )}

      {/* 関連コラム（intro時のみ） */}
      {phase === "intro" && relatedArticles}
    </>
  );
}

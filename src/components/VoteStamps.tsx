"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Stamp = "resonated" | "insight" | "encouraged";

type Counts = Record<Stamp, number>;

const STAMP_META: Record<Stamp, { emoji: string; label: string; color: string }> = {
  resonated: { emoji: "🔮", label: "響いた", color: "text-neon-red" },
  insight: { emoji: "✨", label: "気づいた", color: "text-gold" },
  encouraged: { emoji: "💫", label: "励まされた", color: "text-warm" },
};

type VoteStampsProps = {
  fortuneType: string;
};

function getOrCreateVoterId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem("uranai_voter_id");
    if (!id) {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      id = Array.from(arr, (b) => b.toString(36)).join("").slice(0, 32);
      localStorage.setItem("uranai_voter_id", id);
    }
    return id;
  } catch {
    return "";
  }
}

function getVotedKey(fortuneType: string) {
  return `uranai_voted:${fortuneType}`;
}

function getVotedStamps(fortuneType: string): Set<Stamp> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(getVotedKey(fortuneType));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr.filter((s): s is Stamp => s in STAMP_META));
  } catch {
    return new Set();
  }
}

function markVoted(fortuneType: string, stamp: Stamp) {
  try {
    const current = getVotedStamps(fortuneType);
    current.add(stamp);
    localStorage.setItem(getVotedKey(fortuneType), JSON.stringify([...current]));
  } catch {
    // noop
  }
}

export default function VoteStamps({ fortuneType }: VoteStampsProps) {
  const [counts, setCounts] = useState<Counts>({ resonated: 0, insight: 0, encouraged: 0 });
  const [voted, setVoted] = useState<Set<Stamp>>(new Set());
  const [pending, setPending] = useState<Stamp | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    setVoted(getVotedStamps(fortuneType));
  }, [fortuneType]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const controller = new AbortController();
    fetch(`/api/vote?fortuneType=${encodeURIComponent(fortuneType)}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.counts) setCounts(data.counts);
      })
      .catch(() => {
        // noop
      });
    return () => controller.abort();
  }, [fortuneType]);

  const handleVote = useCallback(
    async (stamp: Stamp) => {
      if (voted.has(stamp) || pending) return;
      setPending(stamp);
      // 楽観的UI: 即座にカウンタアップ
      setCounts((prev) => ({ ...prev, [stamp]: prev[stamp] + 1 }));
      markVoted(fortuneType, stamp);
      setVoted((prev) => new Set(prev).add(stamp));

      try {
        const voterId = getOrCreateVoterId();
        const res = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fortuneType, stamp, voterId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.counts) setCounts(data.counts);
        }
      } catch {
        // noop
      } finally {
        setPending(null);
      }
    },
    [fortuneType, pending, voted],
  );

  const total = counts.resonated + counts.insight + counts.encouraged;

  return (
    <section aria-label="この鑑定への共感度スタンプ" className="mt-4 rounded-lg border border-border bg-surface/40 p-4">
      <p className="mb-3 text-center text-xs text-muted">この鑑定、どう感じましたか？</p>
      <div className="flex flex-wrap items-stretch justify-center gap-2 sm:gap-3">
        {(Object.keys(STAMP_META) as Stamp[]).map((stamp) => {
          const meta = STAMP_META[stamp];
          const isVoted = voted.has(stamp);
          const isPending = pending === stamp;
          return (
            <button
              key={stamp}
              type="button"
              onClick={() => handleVote(stamp)}
              disabled={isVoted || isPending}
              aria-pressed={isVoted}
              aria-label={`${meta.label}に投票（現在${counts[stamp]}票）`}
              className={`flex min-h-11 min-w-[6rem] flex-col items-center justify-center gap-0.5 rounded-lg border px-3 py-2 transition-all ${
                isVoted
                  ? "cursor-default border-gold/60 bg-gold/10"
                  : "border-border bg-surface hover:border-gold/40 hover:bg-surface/80 active:scale-95"
              } ${isPending ? "opacity-60" : ""}`}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {meta.emoji}
              </span>
              <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
              <span className="text-[10px] text-muted" aria-hidden="true">
                {counts[stamp]}
              </span>
            </button>
          );
        })}
      </div>
      {total > 0 && (
        <p className="mt-2 text-center text-[10px] text-muted">
          これまでに{total.toLocaleString()}人が反応
        </p>
      )}
    </section>
  );
}

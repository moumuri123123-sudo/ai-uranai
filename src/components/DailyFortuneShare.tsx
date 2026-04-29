"use client";

type DailyFortuneShareProps = {
  message: string;
};

export default function DailyFortuneShare({ message }: DailyFortuneShareProps) {
  const shareText = `今日の運勢: ${message} | 占処 AI占い`;

  // window.location はハンドラ内で都度取得（SSR/ハイドレーション境界に持ち込まない）
  const handleTwitter = () => {
    const shareUrl = window.location.origin;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleLine = () => {
    const shareUrl = window.location.origin;
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <span className="text-xs text-muted">シェア:</span>
      <button
        onClick={handleTwitter}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/50 text-foreground/60 transition-all hover:border-neon-red/50 hover:text-neon-red hover:shadow-lg hover:shadow-neon-red/10"
        aria-label="Xでシェア"
        title="Xでシェア"
      >
        <span className="text-xs font-bold">X</span>
      </button>
      <button
        onClick={handleLine}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/50 text-foreground/60 transition-all hover:border-[#06C755]/50 hover:text-[#06C755] hover:shadow-lg hover:shadow-[#06C755]/10"
        aria-label="LINEでシェア"
        title="LINEでシェア"
      >
        <span className="text-[9px] font-bold">LINE</span>
      </button>
    </div>
  );
}

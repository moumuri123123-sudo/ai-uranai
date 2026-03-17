"use client";

import { useState } from "react";

type ShareButtonsProps = {
  title: string;
};

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${title} | 占処 AI占い`;

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleLine = () => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <span className="mr-2 text-xs text-muted">結果をシェア:</span>
      <button
        onClick={handleTwitter}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground/70 transition-all hover:border-neon-red/50 hover:text-neon-red hover:shadow-lg hover:shadow-neon-red/10"
        aria-label="Xでシェア"
        title="Xでシェア"
      >
        <span className="text-sm font-bold">X</span>
      </button>
      <button
        onClick={handleLine}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground/70 transition-all hover:border-[#06C755]/50 hover:text-[#06C755] hover:shadow-lg hover:shadow-[#06C755]/10"
        aria-label="LINEでシェア"
        title="LINEでシェア"
      >
        <span className="text-[10px] font-bold">LINE</span>
      </button>
      <button
        onClick={handleCopy}
        className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-foreground/70 transition-all hover:border-gold/50 hover:text-gold hover:shadow-lg hover:shadow-gold/10"
        aria-label="リンクをコピー"
        title="リンクをコピー"
      >
        <span className="text-sm">{copied ? "コピー完了!" : "リンクコピー"}</span>
      </button>
    </div>
  );
}

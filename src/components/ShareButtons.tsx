"use client";

import { useState } from "react";
import type { FortuneResultData } from "@/lib/share-utils";
import { buildShareUrl } from "@/lib/share-utils";
import { generateResultCardImage, downloadBlob } from "@/lib/result-card-canvas";

type ShareButtonsProps = {
  title: string;
  resultData?: FortuneResultData;
};

export default function ShareButtons({ title, resultData }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://uranaidokoro.com";

  const shareUrl = resultData
    ? buildShareUrl(baseUrl, resultData)
    : typeof window !== "undefined"
      ? window.location.href
      : "";

  const shareText = resultData
    ? `${title} - ${resultData.label} | 占処 AI占い`
    : `${title} | 占処 AI占い`;

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

  const handleDownload = async () => {
    if (!resultData || isGenerating) return;
    setIsGenerating(true);
    try {
      const blob = await generateResultCardImage(resultData);
      downloadBlob(blob, `占処_${resultData.fortuneType}_${Date.now()}.png`);
    } catch {
      // 画像生成失敗時は何もしない（ユーザーは再試行可能）
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <span className="text-xs text-muted">結果をシェア:</span>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleTwitter}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground/70 transition-all hover:border-neon-red/50 hover:text-neon-red hover:shadow-lg hover:shadow-neon-red/10"
          aria-label="Xでシェア"
          title="Xでシェア"
        >
          <span className="text-sm font-bold">X</span>
        </button>
        <button
          onClick={handleLine}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground/70 transition-all hover:border-[#06C755]/50 hover:text-[#06C755] hover:shadow-lg hover:shadow-[#06C755]/10"
          aria-label="LINEでシェア"
          title="LINEでシェア"
        >
          <span className="text-[10px] font-bold">LINE</span>
        </button>
        <button
          onClick={handleCopy}
          className="flex h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-foreground/70 transition-all hover:border-gold/50 hover:text-gold hover:shadow-lg hover:shadow-gold/10"
          aria-label="リンクをコピー"
          title="リンクをコピー"
        >
          <span className="text-sm">
            {copied ? "コピー完了!" : "リンクコピー"}
          </span>
        </button>
        {resultData && (
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-foreground/70 transition-all hover:border-neon-red/50 hover:text-neon-red hover:shadow-lg hover:shadow-neon-red/10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="画像を保存"
            title="画像を保存"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            <span className="text-sm">
              {isGenerating ? "生成中..." : "画像保存"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

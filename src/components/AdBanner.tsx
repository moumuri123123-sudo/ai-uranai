"use client";

import { useEffect, useRef } from "react";

type AdBannerProps = {
  slot?: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
};

export default function AdBanner({ slot, format = "auto" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!pubId || !slot || pushed.current) return;
    const el = adRef.current;
    if (!el) return;

    // 広告枠が視界に入った時のみAdSenseスクリプトの読み込みを待ってpush。
    // lazyOnload戦略と組み合わせてモバイルの初期ロードを軽量化する。
    const tryPush = () => {
      if (pushed.current) return true;
      try {
        const w = window as unknown as { adsbygoogle?: unknown[] };
        if (w.adsbygoogle) {
          w.adsbygoogle.push({});
          pushed.current = true;
          return true;
        }
      } catch {
        // noop
      }
      return false;
    };

    let pollTimer: ReturnType<typeof setInterval> | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          if (!tryPush()) {
            let attempts = 0;
            pollTimer = setInterval(() => {
              attempts++;
              if (tryPush() || attempts > 20) {
                if (pollTimer) clearInterval(pollTimer);
              }
            }, 500);
          }
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [pubId, slot]);

  // pub-ID または slot が未設定の場合は何もレンダリングしない
  // （AdSenseポリシー遵守: 広告に見えるプレースホルダーを表示しない）
  if (!pubId || !slot) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <p className="mb-1 text-center text-[10px] tracking-widest text-muted/80">
        スポンサーリンク
      </p>
      <div ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={pubId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </section>
  );
}

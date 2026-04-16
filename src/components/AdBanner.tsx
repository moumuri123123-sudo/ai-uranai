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

    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] })
        .adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // AdSense がまだ読み込まれていない場合は何もしない
    }
  }, [pubId, slot]);

  // pub-ID または slot が未設定の場合は何もレンダリングしない
  // （AdSenseポリシー遵守: 広告に見えるプレースホルダーを表示しない）
  if (!pubId || !slot) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <p className="mb-1 text-center text-[10px] tracking-widest text-muted/50">
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

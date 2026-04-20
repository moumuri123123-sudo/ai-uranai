'use client';

import { useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'ud_cookie_consent_v1';

type ConsentValue = 'accepted' | 'declined';

// localStorage を外部ストアとして購読し、設定済みかどうかをそのまま UI に反映する。
// useSyncExternalStore を使うことで「useEffect 内で setState」パターンを避けられる。
function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener('ud:cookie-consent-changed', callback as EventListener);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('ud:cookie-consent-changed', callback as EventListener);
  };
}

function getSnapshot(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'accepted' || value === 'declined' ? value : null;
  } catch {
    // プライベートモード等では同意バナーは出さない扱い
    return 'declined';
  }
}

// SSR 時はバナーを描画しない（= 同意済み相当）
function getServerSnapshot(): ConsentValue | null {
  return 'declined';
}

export default function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const persist = useCallback((value: ConsentValue) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      window.dispatchEvent(new Event('ud:cookie-consent-changed'));
    } catch {
      // 書き込み失敗時も UI 上は非表示にする
      window.dispatchEvent(new Event('ud:cookie-consent-changed'));
    }
  }, []);

  if (consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Cookie同意"
      className="fixed inset-x-0 bottom-0 z-50 motion-safe:animate-[fadeSlideUp_0.4s_ease-out_forwards]"
    >
      {/* 半透明スクリム風の薄いグラデ（ページ下に落ち着いたトーン） */}
      <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-[#0a0408] to-transparent" />

      <div className="border-t border-border/80 bg-[#0a0408]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0408]/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <div className="text-xs leading-relaxed text-foreground/85 sm:text-sm">
            <p>
              <span className="font-mincho text-gold">占処</span>
              {' '}はサイトの改善や広告配信のため
              <span className="text-neon-red">Cookie</span>
              を使用しています。利用を続けると、同意したものとみなします。
            </p>
            <p className="mt-1 text-[11px] text-muted">
              詳細は
              <Link
                href="/privacy"
                className="mx-1 text-warm underline underline-offset-2 hover:text-gold"
              >
                プライバシーポリシー
              </Link>
              をご確認ください。
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/privacy"
              className="rounded-full border border-border px-4 py-2 text-xs text-warm transition-colors hover:border-gold/60 hover:text-gold sm:text-sm"
            >
              プライバシーポリシーを見る
            </Link>
            <button
              type="button"
              onClick={() => persist('accepted')}
              className="rounded-full border border-gold/60 bg-gold/10 px-5 py-2 text-xs font-semibold text-gold transition-colors hover:bg-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:text-sm"
            >
              同意する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

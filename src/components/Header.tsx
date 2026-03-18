"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/tarot", label: "タロット" },
  { href: "/zodiac", label: "星座占い" },
  { href: "/compatibility", label: "相性占い" },
  { href: "/mbti", label: "MBTI診断" },
  { href: "/dream", label: "夢占い" },
  { href: "/numerology", label: "数秘術" },
  { href: "/blog", label: "コラム" },
  { href: "/history", label: "履歴" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[#0a0408]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-yuji text-2xl tracking-widest text-neon-red animate-neon-pulse"
          onClick={() => setIsOpen(false)}
        >
          占処
        </Link>

        {/* PC用ナビ */}
        <nav className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-gold ${
                pathname === link.href
                  ? "text-gold"
                  : "text-foreground/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ハンバーガーボタン（モバイル） */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground/70 transition-colors hover:text-gold md:hidden"
          aria-label="メニュー"
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          )}
        </button>
      </div>

      {/* モバイルメニュー */}
      {isOpen && (
        <nav className="border-t border-border bg-[#0a0408]/95 px-4 pb-4 pt-2 md:hidden">
          <div className="grid grid-cols-3 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-xl border border-border px-3 py-3 text-center text-sm transition-all hover:border-gold/40 hover:bg-surface ${
                  pathname === link.href
                    ? "border-gold/50 bg-surface text-gold"
                    : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

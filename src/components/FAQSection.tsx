"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/faqs";

type Props = {
  title?: string;
  items: FaqItem[];
  idPrefix?: string;
};

export default function FAQSection({ title, items, idPrefix = "faq" }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <section
      aria-labelledby={`${idPrefix}-heading`}
      className="mx-auto mt-12 w-full max-w-3xl px-4"
    >
      <h2
        id={`${idPrefix}-heading`}
        className="mb-6 text-center font-mincho text-2xl text-gold"
      >
        {title ?? "よくある質問"}
      </h2>
      <ul className="space-y-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `${idPrefix}-panel-${i}`;
          const buttonId = `${idPrefix}-button-${i}`;
          return (
            <li
              key={i}
              className="rounded-lg border border-border bg-[#0a0408]/60 transition-colors hover:border-gold/60"
            >
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-4 text-left text-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                <span className="font-medium">{item.q}</span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-gold transition-transform motion-reduce:transition-none ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="border-t border-border/60 px-4 py-4 text-sm leading-relaxed text-muted"
              >
                {item.a}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

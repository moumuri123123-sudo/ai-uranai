// src/lib/faqs/index.ts
export type FaqItem = {
  q: string;
  a: string;
};

export type FaqSet = {
  title?: string;
  items: FaqItem[];
};

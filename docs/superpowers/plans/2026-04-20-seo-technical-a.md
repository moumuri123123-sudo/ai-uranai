# A案：技術SEO即効パック 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** robots.ts / 占い6ページOGP / FAQ & Organization & Breadcrumb JSON-LD / canonical絶対化 を一括で導入し、クロール制御・SNS流入・リッチリザルト露出を改善する。

**Architecture:** `src/lib/faqs/` に占い別FAQデータソースを集約し、UI (`FAQSection`) と JSON-LD (`FAQJsonLd`) で同じ配列を共有。OG画像はNext.js 16標準の `opengraph-image.tsx` 規約を各ルートに置いてビルド時に自動生成。共通JSON-LD生成は既存 `src/lib/jsonld.ts` を拡張。

**Tech Stack:** Next.js 16 (App Router) / TypeScript strict / Tailwind CSS 4 / `next/og` (ImageResponse) / 既存 `JsonLd` コンポーネント

**前提:** テスト基盤なし。検証は `npm run build` / `npm run lint` + 本番URLでの目視確認 + Google Rich Results Test / Twitter Card Validator で行う。

---

## 対象占いルート（以後の参照用）

`/tarot`, `/zodiac`, `/compatibility`, `/mbti`, `/dream`, `/numerology`

---

## File Structure

**新規作成:**
- `src/app/robots.ts` — クローラー制御
- `src/lib/faqs/index.ts` — FAQ共通型と配列エクスポート
- `src/lib/faqs/tarot.ts`, `zodiac.ts`, `compatibility.ts`, `mbti.ts`, `dream.ts`, `numerology.ts` — 占い別FAQ
- `src/components/FAQSection.tsx` — アコーディオンUI（WCAG準拠）
- `src/components/FAQJsonLd.tsx` — FAQPage schema出力
- `src/components/BreadcrumbJsonLd.tsx` — BreadcrumbList schema出力（layout外配置用）
- `src/app/tarot/opengraph-image.tsx` 等6枚 — 占い別動的OG画像（ビルド時静的化）

**修正:**
- `src/lib/jsonld.ts` — `organizationJsonLd()` / `faqPageJsonLd()` を追加
- `src/app/layout.tsx` — ルートに Organization + WebSite JSON-LD を追加
- 占い6ページ各 `page.tsx` — metadata.twitter追加、FAQSection + FAQJsonLd + BreadcrumbJsonLd 設置、canonicalを絶対URL化
- `/about`, `/share/*`, `/history/page.tsx` — canonical見直し

---

## Task 1: robots.ts 作成

**Files:**
- Create: `src/app/robots.ts`

- [ ] **Step 1: ファイル作成**

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/share/", "/history"],
      },
    ],
    sitemap: "https://uranaidokoro.com/sitemap.xml",
    host: "https://uranaidokoro.com",
  };
}
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功、`.next/server/app/robots.txt` 相当が生成される

- [ ] **Step 3: 開発サーバーで出力確認**

Run: `npm run dev` を起動し、別ターミナルで `curl http://localhost:3000/robots.txt`
Expected:
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /share/
Disallow: /history

Sitemap: https://uranaidokoro.com/sitemap.xml
Host: https://uranaidokoro.com
```

- [ ] **Step 4: コミット**

```bash
git add src/app/robots.ts
git commit -m "feat: クローラ制御用 robots.ts を追加"
```

---

## Task 2: Organization JSON-LD の生成関数追加

既存 `src/lib/jsonld.ts` には Organization を独立出力する関数がないので追加する。

**Files:**
- Modify: `src/lib/jsonld.ts`

- [ ] **Step 1: 既存ファイルの末尾に関数追加**

`src/lib/jsonld.ts` の末尾（breadcrumbJsonLd の下）に追加:

```ts
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 192,
      height: 192,
    },
    sameAs: [
      "https://twitter.com/uranai_dokoro",
    ],
    foundingDate: "2026-03-01",
    description:
      "AIが古来の占術であなたの運命を紡ぐ占いプラットフォーム。タロット・星座・相性・MBTI®・夢占い・数秘術。",
  };
}
```

**注意:** `sameAs` のURLは正確なXアカウントURLに差し替えること。分からなければ該当行を削除してリリース後に追加する。

- [ ] **Step 2: ビルド確認**

Run: `npm run build && npm run lint`
Expected: 両方通過

- [ ] **Step 3: コミット**

```bash
git add src/lib/jsonld.ts
git commit -m "feat: Organization JSON-LD 生成関数を追加"
```

---

## Task 3: layout.tsx で WebSite + Organization JSON-LD を出力

**Files:**
- Modify: `src/app/layout.tsx`
- Uses: `src/components/JsonLd.tsx`, `src/lib/jsonld.ts`

- [ ] **Step 1: import追加**

`src/app/layout.tsx` の冒頭 import群に追加:

```tsx
import JsonLd from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
```

- [ ] **Step 2: `<head>` 内にJSON-LD挿入**

既存の `<head>` タグ内（`<link rel="apple-touch-icon" />` の直後）に追加:

```tsx
<JsonLd id="ld-website" data={websiteJsonLd()} />
<JsonLd id="ld-organization" data={organizationJsonLd()} />
```

- [ ] **Step 3: ビルド + 目視確認**

Run: `npm run build && npm run dev`
ブラウザで `http://localhost:3000/` を開き、DevTools > Elements で `<script id="ld-website">` と `<script id="ld-organization">` が存在し、中身がJSONで読めることを確認。

- [ ] **Step 4: Rich Results Test**

`npm run dev` のURLは外部テストから見えないのでローカル検証は不可。ステップは「本番デプロイ後に https://search.google.com/test/rich-results で `https://uranaidokoro.com/` を検証」として残す。

- [ ] **Step 5: コミット**

```bash
git add src/app/layout.tsx
git commit -m "feat: ルートに Organization + WebSite JSON-LD を出力"
```

---

## Task 4: FAQデータソースの型と共通モジュール

**Files:**
- Create: `src/lib/faqs/index.ts`

- [ ] **Step 1: 型と空エクスポート作成**

```ts
// src/lib/faqs/index.ts
export type FaqItem = {
  q: string;
  a: string;
};

export type FaqSet = {
  title?: string;
  items: FaqItem[];
};
```

- [ ] **Step 2: コミット**

```bash
git add src/lib/faqs/index.ts
git commit -m "feat: FAQデータの共通型を定義"
```

---

## Task 5: 占い別FAQデータ6ファイル作成

文言はこの計画書でそのまま完成させる。修正は実装後に別PR。

**Files:**
- Create: `src/lib/faqs/tarot.ts`, `zodiac.ts`, `compatibility.ts`, `mbti.ts`, `dream.ts`, `numerology.ts`

- [ ] **Step 1: tarot.ts**

```ts
// src/lib/faqs/tarot.ts
import type { FaqSet } from "./index";

export const tarotFaqs: FaqSet = {
  title: "タロット占いについてよくある質問",
  items: [
    {
      q: "タロット占いは本当に当たりますか？",
      a: "タロットは未来を断定するものではなく、現在の自分の状況や無意識を映し出すツールです。占処のAIはカードの意味と質問文脈を踏まえて解釈を提示しますが、最終的な判断はご自身で行ってください。",
    },
    {
      q: "占処のタロット占いは無料で使えますか？",
      a: "はい、完全無料でご利用いただけます。会員登録も不要で、スマホからすぐに占えます。",
    },
    {
      q: "一日に何回まで占えますか？",
      a: "無料版では短時間に連続利用するとレート制限がかかる場合があります。通常の利用範囲では1日10回以上の占いも可能です。",
    },
    {
      q: "同じ質問を何度も占っても大丈夫ですか？",
      a: "気になる質問は時間や気分を変えて占うのは問題ありませんが、短時間で連続して同じ質問をするのは避けるのが一般的です。違う視点で向き合う時間を置きましょう。",
    },
    {
      q: "占い結果は保存できますか？",
      a: "占い履歴は端末のローカル保存に残るほか、結果カード画像をダウンロードしてSNSで共有できます。サーバー側に個人情報は保存されません。",
    },
  ],
};
```

- [ ] **Step 2: zodiac.ts**

```ts
// src/lib/faqs/zodiac.ts
import type { FaqSet } from "./index";

export const zodiacFaqs: FaqSet = {
  title: "星座占いについてよくある質問",
  items: [
    {
      q: "星座占いの結果は毎日変わりますか？",
      a: "はい、占処の星座運勢はAIが毎日最新の運気を読み取って生成します。デイリー運勢ページからも確認できます。",
    },
    {
      q: "自分の星座が分からない場合はどうすればいいですか？",
      a: "生年月日を入力すると自動で星座を判別します。境界日（星座の変わり目）に生まれた方はサインが異なる可能性があるため、時刻も合わせて参考にしてください。",
    },
    {
      q: "12星座以外のホロスコープ要素も見られますか？",
      a: "数秘術・MBTI・タロットなど他の占術と組み合わせるとより多角的な示唆が得られます。占処では各占いページから相互に行き来できます。",
    },
    {
      q: "毎朝ランキングをチェックする方法はありますか？",
      a: "デイリーランキングページから当日の1位〜12位を一覧で確認できます。ブックマークまたはホーム画面に追加して毎日お使いください。",
    },
    {
      q: "星座占いの結果をシェアできますか？",
      a: "結果画面下部のシェアボタンから X/LINE/URLコピー/結果カード画像ダウンロードが可能です。",
    },
  ],
};
```

- [ ] **Step 3: compatibility.ts**

```ts
// src/lib/faqs/compatibility.ts
import type { FaqSet } from "./index";

export const compatibilityFaqs: FaqSet = {
  title: "相性占いについてよくある質問",
  items: [
    {
      q: "相性占いは恋愛以外でも使えますか？",
      a: "はい、友人・家族・職場の人間関係など様々な相性診断にお使いいただけます。占いたい関係性を入力欄で指定してください。",
    },
    {
      q: "相手の正確な生年月日が分からなくても占えますか？",
      a: "星座や血液型だけでも簡易的な相性診断は可能ですが、生年月日が揃うほど精度は上がります。",
    },
    {
      q: "相性の悪い結果が出た場合どう受け止めればいいですか？",
      a: "相性占いは絶対評価ではなく傾向の指標です。合わない点が示された場合は、お互いの違いを理解するヒントとして活用しましょう。",
    },
    {
      q: "占い結果を相手に見せても大丈夫ですか？",
      a: "シェア機能で送信できますが、相手の感じ方は人それぞれです。ポジティブな話題として楽しむ場で使うのがおすすめです。",
    },
    {
      q: "過去に占った結果をもう一度見られますか？",
      a: "占い履歴はブラウザのローカルストレージに保存されており、履歴ページからアクセスできます。",
    },
  ],
};
```

- [ ] **Step 4: mbti.ts**

```ts
// src/lib/faqs/mbti.ts
import type { FaqSet } from "./index";

export const mbtiFaqs: FaqSet = {
  title: "MBTI診断についてよくある質問",
  items: [
    {
      q: "占処のMBTI診断は公式のものですか？",
      a: "占処の診断はMBTI®の枠組みを参考にしたエンターテインメント目的の簡易診断です。MBTI®は The Myers-Briggs Company の登録商標であり、公式診断はマイヤーズ・ブリッグス タイプ指標®（MBTI®）の有資格者による実施をご案内しています。",
    },
    {
      q: "診断結果は何分くらいで出ますか？",
      a: "AIが回答内容を解析するため数秒で結果が出ます。じっくり考えて回答した方が精度が上がります。",
    },
    {
      q: "結果のタイプが前回と変わりました。正しいのはどちら？",
      a: "MBTIは回答時の心境や状況で多少ブレることがあります。境界値のタイプ（INFPとINFJなど）は揺れやすいので、両方の特徴を参考にすると立体的に自分を理解できます。",
    },
    {
      q: "相性占いとMBTIを組み合わせられますか？",
      a: "はい、相性占いページでMBTIタイプ同士の組み合わせも診断できます。",
    },
    {
      q: "結果を保存・共有できますか？",
      a: "シェアボタンからX/LINE等にシェアできます。履歴ページで過去の診断結果も確認できます。",
    },
  ],
};
```

- [ ] **Step 5: dream.ts**

```ts
// src/lib/faqs/dream.ts
import type { FaqSet } from "./index";

export const dreamFaqs: FaqSet = {
  title: "夢占いについてよくある質問",
  items: [
    {
      q: "どんな夢でも占ってもらえますか？",
      a: "はい、短い断片でも長いストーリーでも、思い出せる範囲で入力してください。AIが象徴を読み取って解釈します。",
    },
    {
      q: "同じ夢を何度も見るのはなぜですか？",
      a: "繰り返し見る夢は無意識が強く訴えているテーマを示す可能性があります。占処の結果と合わせて、自分の現状を振り返るヒントにしてください。",
    },
    {
      q: "悪夢を占うのが怖いです。",
      a: "悪夢の象徴はネガティブな出来事の予告ではなく、ストレスや感情の浄化を示すことが多いです。占いは安心のために使ってください。",
    },
    {
      q: "夢占いトレンドページでは何が見られますか？",
      a: "その月に多くの人が入力した夢のキーワード上位を集計しており、匿名でワード雲ランキングが見られます。自分の夢とリンクしていれば同じ占いを試せます。",
    },
    {
      q: "夢の内容に個人情報を入力しても大丈夫ですか？",
      a: "夢の内容はAI解釈のため送信されますが、個人名・住所などの個人情報は入れずに特徴だけを書いてください。",
    },
  ],
};
```

- [ ] **Step 6: numerology.ts**

```ts
// src/lib/faqs/numerology.ts
import type { FaqSet } from "./index";

export const numerologyFaqs: FaqSet = {
  title: "数秘術についてよくある質問",
  items: [
    {
      q: "数秘術の運命数はどう計算しますか？",
      a: "生年月日の全ての数字を1桁になるまで足し合わせたものが運命数です。占処では自動で計算するため、日付を入力するだけでOKです。",
    },
    {
      q: "マスターナンバー（11・22・33）は何が特別ですか？",
      a: "マスターナンバーは一桁にしない特殊な運命数で、強いスピリチュアル性を持つとされています。占処でも自動検知して解説を表示します。",
    },
    {
      q: "引っ越しや改名で運命数は変わりますか？",
      a: "生年月日ベースの運命数は一生変わりません。改名などで変わるのは別の数（氏名数など）です。占処では運命数に絞って占います。",
    },
    {
      q: "他の占いと結果が違う場合はどうすればいいですか？",
      a: "占術ごとに着眼点が違うため結果のズレは自然です。共通して出るテーマほど信頼度が高いと考えてみてください。",
    },
    {
      q: "結果をSNSでシェアできますか？",
      a: "シェアボタンからX・LINE等にシェアできます。結果カード画像もダウンロード可能です。",
    },
  ],
};
```

- [ ] **Step 7: ビルド確認**

Run: `npm run build && npm run lint`
Expected: 通過

- [ ] **Step 8: コミット**

```bash
git add src/lib/faqs/
git commit -m "feat: 占い6種類のFAQデータを追加"
```

---

## Task 6: FAQPage JSON-LD 生成関数と出力コンポーネント

**Files:**
- Modify: `src/lib/jsonld.ts`
- Create: `src/components/FAQJsonLd.tsx`

- [ ] **Step 1: jsonld.ts に FAQPage 関数追加**

`src/lib/jsonld.ts` の末尾に追加:

```ts
export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };
}
```

- [ ] **Step 2: FAQJsonLdコンポーネント作成**

```tsx
// src/components/FAQJsonLd.tsx
import JsonLd from "./JsonLd";
import { faqPageJsonLd } from "@/lib/jsonld";
import type { FaqItem } from "@/lib/faqs";

type Props = {
  id: string;
  items: FaqItem[];
};

export default function FAQJsonLd({ id, items }: Props) {
  if (!items || items.length === 0) return null;
  return <JsonLd id={id} data={faqPageJsonLd(items)} />;
}
```

- [ ] **Step 3: ビルド + リント**

Run: `npm run build && npm run lint`
Expected: 通過

- [ ] **Step 4: コミット**

```bash
git add src/lib/jsonld.ts src/components/FAQJsonLd.tsx
git commit -m "feat: FAQPage JSON-LD 生成関数とコンポーネントを追加"
```

---

## Task 7: FAQSection UIコンポーネント（アコーディオン、WCAG準拠）

**Files:**
- Create: `src/components/FAQSection.tsx`

- [ ] **Step 1: コンポーネント実装**

```tsx
// src/components/FAQSection.tsx
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
```

- [ ] **Step 2: ビルド + リント**

Run: `npm run build && npm run lint`
Expected: 通過

- [ ] **Step 3: コミット**

```bash
git add src/components/FAQSection.tsx
git commit -m "feat: FAQSection UIコンポーネント（a11y対応アコーディオン）"
```

---

## Task 8: BreadcrumbJsonLd コンポーネント

`src/lib/jsonld.ts` の `breadcrumbJsonLd()` 関数は既にある。コンポーネント化する。

**Files:**
- Create: `src/components/BreadcrumbJsonLd.tsx`

- [ ] **Step 1: 実装**

```tsx
// src/components/BreadcrumbJsonLd.tsx
import JsonLd from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

type Props = {
  id: string;
  segments: { name: string; path: string }[];
};

export default function BreadcrumbJsonLd({ id, segments }: Props) {
  return <JsonLd id={id} data={breadcrumbJsonLd(segments)} />;
}
```

- [ ] **Step 2: ビルド + リント**

Run: `npm run build && npm run lint`
Expected: 通過

- [ ] **Step 3: コミット**

```bash
git add src/components/BreadcrumbJsonLd.tsx
git commit -m "feat: BreadcrumbJsonLd コンポーネントを追加"
```

---

## Task 9: 占い6ページに FAQ + Breadcrumb を配置

ここは6ページ同じ作業を6回。タロットを例示する。他5ページも同じ手順で別コミットに分ける。

**Files:**
- Modify: `src/app/tarot/page.tsx` (他 zodiac/compatibility/mbti/dream/numerology も同じ)

- [ ] **Step 1: tarot/page.tsx にimport追加**

ファイル冒頭のimport群に追加:

```tsx
import FAQSection from "@/components/FAQSection";
import FAQJsonLd from "@/components/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { tarotFaqs } from "@/lib/faqs/tarot";
```

- [ ] **Step 2: 既存のページ本体（return内）の末尾、`</main>` 直前に挿入**

```tsx
<BreadcrumbJsonLd
  id="bc-tarot"
  segments={[{ name: "タロット占い", path: "/tarot" }]}
/>
<FAQJsonLd id="faq-tarot" items={tarotFaqs.items} />
<FAQSection
  title={tarotFaqs.title}
  items={tarotFaqs.items}
  idPrefix="faq-tarot"
/>
```

- [ ] **Step 3: ビルド確認**

Run: `npm run build && npm run dev`
ブラウザで `http://localhost:3000/tarot` を開き、ページ下部にFAQアコーディオンが表示されること、DevToolsで `ld-tarot` と `faq-tarot` の script tagが存在することを確認。

- [ ] **Step 4: コミット**

```bash
git add src/app/tarot/page.tsx
git commit -m "feat(tarot): FAQ + Breadcrumb JSON-LD を追加"
```

- [ ] **Step 5: zodiac ページに同じ変更**

import:
```tsx
import FAQSection from "@/components/FAQSection";
import FAQJsonLd from "@/components/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { zodiacFaqs } from "@/lib/faqs/zodiac";
```

挿入（`</main>` 直前）:
```tsx
<BreadcrumbJsonLd
  id="bc-zodiac"
  segments={[{ name: "星座占い", path: "/zodiac" }]}
/>
<FAQJsonLd id="faq-zodiac" items={zodiacFaqs.items} />
<FAQSection
  title={zodiacFaqs.title}
  items={zodiacFaqs.items}
  idPrefix="faq-zodiac"
/>
```

ビルド確認→ `git commit -m "feat(zodiac): FAQ + Breadcrumb JSON-LD を追加"`

- [ ] **Step 6: compatibility ページに同じ変更**

import:
```tsx
import FAQSection from "@/components/FAQSection";
import FAQJsonLd from "@/components/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { compatibilityFaqs } from "@/lib/faqs/compatibility";
```

挿入:
```tsx
<BreadcrumbJsonLd
  id="bc-compatibility"
  segments={[{ name: "相性占い", path: "/compatibility" }]}
/>
<FAQJsonLd id="faq-compatibility" items={compatibilityFaqs.items} />
<FAQSection
  title={compatibilityFaqs.title}
  items={compatibilityFaqs.items}
  idPrefix="faq-compatibility"
/>
```

ビルド→ `git commit -m "feat(compatibility): FAQ + Breadcrumb JSON-LD を追加"`

- [ ] **Step 7: mbti ページに同じ変更**

import:
```tsx
import FAQSection from "@/components/FAQSection";
import FAQJsonLd from "@/components/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { mbtiFaqs } from "@/lib/faqs/mbti";
```

挿入:
```tsx
<BreadcrumbJsonLd
  id="bc-mbti"
  segments={[{ name: "MBTI診断", path: "/mbti" }]}
/>
<FAQJsonLd id="faq-mbti" items={mbtiFaqs.items} />
<FAQSection
  title={mbtiFaqs.title}
  items={mbtiFaqs.items}
  idPrefix="faq-mbti"
/>
```

ビルド→ `git commit -m "feat(mbti): FAQ + Breadcrumb JSON-LD を追加"`

- [ ] **Step 8: dream ページに同じ変更**

import:
```tsx
import FAQSection from "@/components/FAQSection";
import FAQJsonLd from "@/components/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { dreamFaqs } from "@/lib/faqs/dream";
```

挿入:
```tsx
<BreadcrumbJsonLd
  id="bc-dream"
  segments={[{ name: "夢占い", path: "/dream" }]}
/>
<FAQJsonLd id="faq-dream" items={dreamFaqs.items} />
<FAQSection
  title={dreamFaqs.title}
  items={dreamFaqs.items}
  idPrefix="faq-dream"
/>
```

ビルド→ `git commit -m "feat(dream): FAQ + Breadcrumb JSON-LD を追加"`

- [ ] **Step 9: numerology ページに同じ変更**

import:
```tsx
import FAQSection from "@/components/FAQSection";
import FAQJsonLd from "@/components/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { numerologyFaqs } from "@/lib/faqs/numerology";
```

挿入:
```tsx
<BreadcrumbJsonLd
  id="bc-numerology"
  segments={[{ name: "数秘術", path: "/numerology" }]}
/>
<FAQJsonLd id="faq-numerology" items={numerologyFaqs.items} />
<FAQSection
  title={numerologyFaqs.title}
  items={numerologyFaqs.items}
  idPrefix="faq-numerology"
/>
```

ビルド→ `git commit -m "feat(numerology): FAQ + Breadcrumb JSON-LD を追加"`

---

## Task 10: 占い6ページのOG画像（opengraph-image.tsx）

Next.js 16標準の `opengraph-image.tsx` 規約を使う。ビルド時に ImageResponse から PNG が生成され、CDN 配信される。

**Files:**
- Create: `src/app/tarot/opengraph-image.tsx`, `zodiac/`, `compatibility/`, `mbti/`, `dream/`, `numerology/` の配下6枚

- [ ] **Step 1: tarot/opengraph-image.tsx 作成**

```tsx
// src/app/tarot/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "占処 タロット占い";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0408 0%, #1a0a14 50%, #2a0a1f 100%)",
          color: "#f5e6d0",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 48, color: "#ffd700", marginBottom: 16 }}>
          占処
        </div>
        <div style={{ fontSize: 92, fontWeight: 700, color: "#ff2d55" }}>
          タロット占い
        </div>
        <div style={{ fontSize: 32, color: "#f5e6d0", marginTop: 24 }}>
          カードが告げる、あなたの運命
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: zodiac/opengraph-image.tsx**

上記コードをコピーし、以下を変更:
- `alt`: "占処 星座占い"
- 大見出し: "星座占い"
- サブ: "12星座で読み解く今日の運勢"

- [ ] **Step 3: compatibility/opengraph-image.tsx**

- `alt`: "占処 相性占い"
- 大見出し: "相性占い"
- サブ: "二人の縁をAIが紐解く"

- [ ] **Step 4: mbti/opengraph-image.tsx**

- `alt`: "占処 MBTI診断"
- 大見出し: "MBTI診断"
- サブ: "16タイプであなたを知る"

- [ ] **Step 5: dream/opengraph-image.tsx**

- `alt`: "占処 夢占い"
- 大見出し: "夢占い"
- サブ: "夢が告げる心の声"

- [ ] **Step 6: numerology/opengraph-image.tsx**

- `alt`: "占処 数秘術"
- 大見出し: "数秘術"
- サブ: "数字に宿る、あなたの運命"

- [ ] **Step 7: ビルド確認**

Run: `npm run build`
Expected: `.next/server/app/{tarot,zodiac,...}/opengraph-image` が生成される

- [ ] **Step 8: 開発サーバーで各OG画像にアクセス**

Run: `npm run dev`
ブラウザで順番に開く:
- `http://localhost:3000/tarot/opengraph-image`
- `http://localhost:3000/zodiac/opengraph-image`
- `http://localhost:3000/compatibility/opengraph-image`
- `http://localhost:3000/mbti/opengraph-image`
- `http://localhost:3000/dream/opengraph-image`
- `http://localhost:3000/numerology/opengraph-image`

Expected: 各ルートで PNG 画像（1200x630）が表示される

- [ ] **Step 9: まとめてコミット**

```bash
git add src/app/tarot/opengraph-image.tsx src/app/zodiac/opengraph-image.tsx src/app/compatibility/opengraph-image.tsx src/app/mbti/opengraph-image.tsx src/app/dream/opengraph-image.tsx src/app/numerology/opengraph-image.tsx
git commit -m "feat: 占い6ページに opengraph-image を追加"
```

---

## Task 11: 占い6ページの metadata 強化（twitter card / OG images）

opengraph-image.tsx を置くと OG画像は自動でmetadataに紐付く。しかし twitter card の明示指定と、個別ページのOG titleのデフォルトでよいかチェックする必要がある。

**Files:**
- Modify: `src/app/tarot/page.tsx`, `zodiac/page.tsx`, `compatibility/page.tsx`, `mbti/page.tsx`, `dream/page.tsx`, `numerology/page.tsx`

- [ ] **Step 1: tarot/page.tsx の metadata export 確認**

該当ファイルの `export const metadata: Metadata = { ... }` を確認する。`twitter` が未設定なら追加:

```tsx
export const metadata: Metadata = {
  // ... 既存設定 ...
  alternates: {
    canonical: "https://uranaidokoro.com/tarot",
  },
  twitter: {
    card: "summary_large_image",
    title: "タロット占い｜占処",
    description: "AIが22枚の大アルカナからあなたの運命を読み解きます。無料・匿名・すぐ占える。",
  },
};
```

既存の `canonical` が相対パス（`"/tarot"`）なら絶対URL（`"https://uranaidokoro.com/tarot"`）に直す。metadataBaseで自動補完されるので相対のままでも動くが、SNSクローラ互換のため絶対が安全。

- [ ] **Step 2: 他5ページにも同じ修正**

zodiac / compatibility / mbti / dream / numerology 各 page.tsx でも twitter と canonical を確認・追加。

descriptionは占い別に1-2行で内容を変える。

- [ ] **Step 3: ビルド + リント**

Run: `npm run build && npm run lint`
Expected: 通過

- [ ] **Step 4: コミット**

```bash
git add src/app/tarot/page.tsx src/app/zodiac/page.tsx src/app/compatibility/page.tsx src/app/mbti/page.tsx src/app/dream/page.tsx src/app/numerology/page.tsx
git commit -m "feat: 占い6ページに twitter card と canonical絶対URLを追加"
```

---

## Task 12: canonical URL 棚卸し（全ページ一括）

A-5の仕上げ。`/share/*`, `/history`, `/about`, `/contact` 等、画像以外のページも canonical を確認する。

**Files:**
- Modify: `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/terms/page.tsx`, `src/app/privacy/page.tsx`, `src/app/history/page.tsx`, `src/app/share/page.tsx`（該当があれば）

- [ ] **Step 1: 対象ファイルを確認**

Run: `grep -r "canonical" src/app/ --include="*.tsx"`
Expected: 現状の canonical 設定一覧が出る

- [ ] **Step 2: 各ファイルの canonical を絶対URLに修正**

相対パス `"/about"` → 絶対URL `"https://uranaidokoro.com/about"` に修正（各ファイルの `metadata.alternates.canonical`）。

history, shareページは `robots: { index: false, follow: false }` をmetadataに追加（ランディングページではないため）。

```tsx
export const metadata: Metadata = {
  // ...既存...
  robots: { index: false, follow: true },
};
```

- [ ] **Step 3: ビルド + リント**

Run: `npm run build && npm run lint`
Expected: 通過

- [ ] **Step 4: コミット**

```bash
git add src/app/
git commit -m "fix: canonical を絶対URL統一、history/share は noindex"
```

---

## Task 13: 本番デプロイと検証

- [ ] **Step 1: Vercelに push して本番反映**

```bash
git push origin main
```

Vercel が自動デプロイする（通常5分程度）。

- [ ] **Step 2: robots.txt 目視確認**

ブラウザで https://uranaidokoro.com/robots.txt
Expected: Task1で定義した内容が表示される

- [ ] **Step 3: Google Rich Results Test**

https://search.google.com/test/rich-results に以下を順次入力して、エラーがないこと＋リッチリザルト対応を確認:

- `https://uranaidokoro.com/` → Organization, WebSite
- `https://uranaidokoro.com/tarot` → FAQPage, BreadcrumbList, WebApplication
- `https://uranaidokoro.com/zodiac` 等、残り5占いも同様

- [ ] **Step 4: Twitter Card Validator**

https://cards-dev.twitter.com/validator に以下を入力:
- `https://uranaidokoro.com/tarot`
- `https://uranaidokoro.com/zodiac`
- 残り4ページも確認

Expected: 1200x630 の summary_large_image カードが各占いのOG画像で表示される

- [ ] **Step 5: Facebook Sharing Debugger**

https://developers.facebook.com/tools/debug/ で同じURLを scrape し、OGPが正しいこと確認。

- [ ] **Step 6: Search Console の robots.txt テスター**

Search Console > 設定 > robots.txt > 再取得をリクエスト

- [ ] **Step 7: 検証後メモ**

問題があれば GitHub Issue として起票し、別PRで修正。

---

## Self-Review チェックリスト（実装前の確認事項）

- [ ] Spec A-1〜A-6 全てに対応するTaskがある: Task1(A-1), Task11+12(A-2), Task5-9(A-3 FAQ JSON-LD), Task2-3(A-4 Org), Task12(A-5 canonical), Task8-9(A-6 Breadcrumb) — **全カバー**
- [ ] プレースホルダーなし: sameAs のXアカウントURLのみ「分からなければ削除」と明記してある
- [ ] 型整合: `FaqItem` / `FaqSet` を Task4 で定義し、Task5-9 で一貫して参照
- [ ] 各Taskが独立コミット可能
- [ ] 本番検証（Task13）がある

---

## 完了判定

全Taskのチェックボックスが埋まり、Task13 Step3-6 で以下が「エラーなし」になれば完了:
- Rich Results Test: 6占いページ+トップでFAQ/Org/Breadcrumb認識
- Twitter Card Validator: 6占いで summary_large_image 表示
- robots.txt 正常レスポンス

その後 B案計画（コンテンツ運用）の writing-plans に進む。

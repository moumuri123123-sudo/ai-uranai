# 占処 SEO・集客ブラッシュアップ設計書

**作成日**: 2026-04-20
**対象**: uranaidokoro.com（Next.js 16 / App Router）
**目的**: 検索流入・SNS流入・リピート訪問の3軸で集客を底上げする
**実装者**: Claude（コード変更）＋ ユーザー（運用判断のみ）

---

## スコープ概要

3つのパッケージを一括実装する。

| パック | 内容 | 工数目安 |
|---|---|---|
| A | 技術SEO即効パック | 1〜2日 |
| B | コンテンツ運用強化パック | 3〜5日＋継続運用 |
| C | 再訪導線パック（PWA・ブックマーク・通知導線のみ。LINEはスコープ外） | 1〜2日 |

合計で5〜9日相当。段階リリース可。

---

## A案：技術SEO即効パック

### A-1. `src/app/robots.ts` の新規作成
- Next.js App Router標準の `robots.ts` を作成
- `disallow`: `/api/*`, `/share/*`, `/history`, `/api/og-result`
- `allow`: `/`
- `sitemap`: `https://uranaidokoro.com/sitemap.xml`
- User-agent別設定は不要（デフォルト1つ）

### A-2. 占い6ページのmetadata強化
対象: `/tarot` `/zodiac` `/dream` `/love` `/name` `/birth`（実際のパスはコード確認時に確定）

各ページに以下を追加：
- `openGraph.images`: 占い種別ごとに専用画像
- `twitter.card: 'summary_large_image'`
- `twitter.images`: OG画像と同URL

**OG画像の生成方法**: 静的画像を`public/og/{type}.png`に6枚配置する方式とする（動的生成は`og-result`で既に実装済みのため、占いトップページ用は静的でキャッシュ効率を優先）。1200x630、占処のレトロネオンデザインに統一。

### A-3. FAQPage JSON-LD追加
対象: 占い6ページ＋`/about`＋主要ブログ記事（全52記事は工数過多なのでPV上位10記事を想定、実装時に確定）

各占いページには「5問程度」のFAQを本文に含め、同内容を `FAQPage` schema として出力。JSON-LDとUI表示は**同じデータソース**を使う（二重管理回避）。実装形:

```ts
// src/lib/faqs/tarot.ts など
export const tarotFaqs = [
  { q: "タロット占いは当たりますか？", a: "..." },
  ...
];
```

- UIは`<FAQSection items={tarotFaqs} />` で描画
- JSON-LDは`<FAQJsonLd items={tarotFaqs} />` で出力
- 両方とも同配列を参照

### A-4. Organization JSON-LD拡充
`src/app/layout.tsx` の既存 Organization スキーマに以下を追加：
- `logo`: `https://uranaidokoro.com/icon.png` 相当
- `sameAs`: X公式アカウントURL、ブログRSSなど
- `foundingDate`: サイト公開日
- `name`: "占処"

### A-5. canonical URL絶対化の統一
- 現状相対パスで指定されている箇所（share系/history系）を全て `metadataBase` ベースの絶対URLに修正
- 確認対象: `src/app/**/page.tsx` の `alternates.canonical` 設定全て
- 未設定ページには追加

### A-6. パンくず強化（JSON-LD `BreadcrumbList`）
- 既存のUI上の記号`/`表記はそのまま活用
- 全ページ（ホーム以外）で `BreadcrumbList` schema を追加
- 共通コンポーネント `<BreadcrumbJsonLd segments={[...]} />` を新設

---

## B案：コンテンツ運用強化パック

### B-1. 記事内CTA増強
- 新規コンポーネント `<OracleCTA type="tarot" position="middle|bottom" />`
- 各ブログ記事のfrontmatterに `primaryOracle: tarot|zodiac|dream|love|name|birth` を追記
- MDX/Markdown側で中盤と最下部に自動挿入
- 中盤CTAは「文字数の50%地点」または「3つ目のH2の直前」で挿入（MDXプラグイン側で判定）

### B-2. 関連記事アルゴリズム改善
- 現状: 3記事固定表示
- 新: タグ＋カテゴリ重み付けで最大6記事
- スコア式: `score = (共通タグ数 * 3) + (同カテゴリ ? 1 : 0) + (最近180日以内 ? 0.5 : 0)`
- 同率時は新しい方を優先
- frontmatter未整備の記事には一括スクリプトで`tags: []`を最低1つ設定

### B-3. 占いページFAQ UIセクション
- A-3 のFAQデータソースを使い、アコーディオンUIで表示
- WCAG 2.1 AA準拠: `<button aria-expanded>` パターン、キーボード操作、`prefers-reduced-motion`対応
- 占い6ページ＋`/about`

### B-4. 新記事運用テンプレ化
- `src/content/_template.md` を作成
- 推奨構成: H1（タイトル）→ 導入100字 → H2×3〜5 → CTA → H2 まとめ → 関連リンク
- 目安字数: 1500-2000字
- 運用ガイド `docs/content-guide.md` を新設（記事執筆ルール、内部リンクチェック、公開フロー）
- **新記事の生成方針**: Gemini API で下書き生成 → 手動校正（ユーザー決定済み）
  - 補助スクリプト `scripts/draft-article.ts`（Gemini呼び出し、テンプレ注入、Markdown出力）も作成

### B-5. 既存記事の内部リンク一括増設
- `scripts/add-internal-links.ts` で52記事を走査
- キーワード→占いページURLのマッピング辞書を使用
- 1記事あたり最大3箇所まで（過剰SEO回避）
- dry-runモード対応、実行前に必ず差分プレビュー
- 既にリンク化されているキーワードはスキップ

---

## C案：再訪導線パック（LINE関連はスコープ外）

### C-1. PWA化（=元セクション3.3）
- `public/manifest.json` を新規作成
  - `name`: "占処（うらないどころ）"
  - `short_name`: "占処"
  - `icons`: 192x192, 512x512, maskable対応
  - `theme_color`, `background_color`: レトロネオン基調
  - `display`: `standalone`
  - `start_url`: `/`
  - `scope`: `/`
- `src/app/layout.tsx`のmetadataに`manifest`フィールド追加
- 既存Service Workerとの衝突確認：既存SWがある場合はPWA化に合わせてキャッシュ戦略を見直す（detail: app shell + stale-while-revalidate）
- **ホーム画面追加促進バナー**:
  - 2回目訪問時に表示（localStorage `visit_count >= 2`）
  - iOS: 手順画像付き「共有→ホーム画面に追加」
  - Android: `beforeinstallprompt`イベントでインストール促進
  - 閉じたら7日間非表示（localStorage記録）

### C-2. ブックマーク誘導の軽量導線（=元セクション3.4）
- 占い結果画面下部に「また明日の運勢を逃さないために」セクション追加
- 3択UIの小カード：
  - 📖 ブックマーク（Ctrl+D案内、iOS/Android別々の手順）
  - 🏠 ホーム画面に追加（C-1のバナーを呼び出すボタン）
  - 🔔 Xでフォロー（既存のXアカウントへ誘導、新規DB不要）
- デザインは既存シェアボタンと統一

### C-3. 通知導線整理（=元セクション3.5）
- 全ページ共通フッターに以下のリンクを集約表示：
  - 「毎日の運勢 →」`/daily`（もしくは該当パス）
  - 「星座ランキング →」`/ranking`
  - 「夢占いトレンド →」`/dream-trends`
- 占い結果画面にも同セットを「他の占いを試す」の近くに配置
- 文言は「毎日チェックして運気を逃さない」系の統一コピー

---

## 非スコープ（今回やらないこと）

- LINE公式アカウント連携（朝プッシュ、誘導バナー）
- LINE友だち追加UI
- Web Push通知（ブラウザ通知API）
- メルマガ導線
- 新規ブログ記事の実執筆（テンプレと下書きスクリプトの整備のみ）
- Stripe/Supabaseの課金系（収益化ロードマップ別枠）
- Vercel Pro移行

---

## データフロー

- **FAQ**: 単一データソース（`src/lib/faqs/*.ts`）→ UI + JSON-LD 両用
- **OG画像**: 静的（A案）と動的（既存og-result）の二層
- **内部リンク**: 静的辞書（`src/lib/internal-links.ts`）をMDXビルド時に適用
- **関連記事**: 記事frontmatterのタグを基にビルド時に計算、静的生成

---

## エラー処理・セキュリティ

- robots.ts記述ミスで全クロール拒否にならないよう、実装後は`curl https://uranaidokoro.com/robots.txt`で必ず目視確認
- FAQデータの改行・引用符は JSON-LD escape処理を通す（既存Article JSON-LDと同パターンを再利用）
- OG画像はアクセス可能な絶対URLで参照（相対URLはSNSクロールで落ちる）
- LocalStorageアクセス前に `typeof window !== 'undefined'` ガード（SSR対応）

---

## テスト・検証

- `robots.txt` と `sitemap.xml` をブラウザで確認
- Google Rich Results Test で占いページ・ブログ記事のJSON-LDを検証（FAQ, Article, Breadcrumb）
- Twitter Card Validator / Facebook Sharing Debugger で占い6ページのOGP確認
- Lighthouse PWAスコアを実装前後で比較（目標: インストール可能判定クリア）
- モバイル実機（iOS Safari + Android Chrome）でホーム画面追加バナー表示確認
- Search Console で `robots.txt` テスター実行

---

## 実装順序の推奨

1. **A案全部**（PR1本、即反映）
2. **B案 B-1〜B-3**（CTA/関連記事/FAQ UI、PR1本）
3. **B案 B-4〜B-5**（テンプレ+内部リンク一括、PR1本、dry-run確認要）
4. **C案全部**（PR1本）

各フェーズ完了後にVercelで本番確認→問題なければ次へ。

---

## オープン質問（実装時に確認が必要）

- 占いページの正確なルーティング（`/tarot`なのか`/oracle/tarot`なのか等はコード確認時に確定）
- 主要ブログ記事10件の選定基準（GA4のPVで選ぶか、直近更新日で選ぶか）
- ブックマーク誘導のiOS/Android判定ロジック（User-Agent簡易判定で可）

これらは実装フェーズで都度確認する。

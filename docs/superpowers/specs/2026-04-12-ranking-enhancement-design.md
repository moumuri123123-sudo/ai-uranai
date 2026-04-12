# ランキングページ大規模改善 設計書

## 概要
占処のランキングページを「見て終わり」から「毎日来たくなる」ページに改善する。

## 変更一覧

### 1. 順位変動表示（↑↓→）
- 昨日の日付で `getDailyRanking()` を再計算し、今日との差分を算出（DB不要）
- 表示: `↑3`（上昇・金色）/ `↓2`（下降・muted）/ `→`（変動なし・グレー）
- `daily-ranking.ts` に `getYesterdayRanking()` と差分計算関数を追加

### 2. 詳細運勢（タップ展開）
- 各星座をタップすると下に展開（Client Component化）
- 表示内容:
  - 仕事運・恋愛運・金運（◎○△の3段階）
  - ラッキーカラー・ラッキーアイテム・ラッキー時間帯
  - 2〜3行の解説文
- Geminiで12星座分を1リクエストで一括生成
- ISR（1時間キャッシュ）でServer Componentがデータ取得、Client Componentに渡す

### 3. SEO改善
- `generateMetadata()` でタイトルに日付を動的挿入: 「今日の星座占いランキング【4月12日】| 占処」
- OGP descriptionにも日付と1位の星座名を含める
- JSON-LD構造化データ（WebPage + ItemList）を追加

### 4. シェアOGP画像生成
- 新規API: `/api/og-ranking`
  - クエリパラメータ: `sign`, `rank`, `diff`, `work`, `love`, `money`
  - 出力: 1200x630px PNG（既存OGP生成パターンを踏襲）
- 展開内に「Xでシェア」ボタンを設置
- シェア画像に「蟹座 今日2位！↑3 仕事◎恋愛○金運△」のような情報を含める

### 5. デザイン（ランキングページ内のみ）
- 展開アニメーション: 既存の `fadeSlideUp` を活用
- 運勢アイコン: 💼仕事 / 💕恋愛 / 💰金運
- ◎○△の色分け: ◎=gold, ○=foreground, △=muted
- 既存CSS変数・フォントを使用、新規デザイントークン追加なし

## ファイル構成

| 種別 | ファイル | 内容 |
|------|---------|------|
| 修正 | `src/lib/daily-ranking.ts` | 昨日の順位計算、詳細運勢の型定義、Gemini一括生成 |
| 修正 | `src/app/daily-ranking/page.tsx` | Server Component（データ取得 + generateMetadata） |
| 新規 | `src/app/daily-ranking/RankingList.tsx` | Client Component（タップ展開UI） |
| 新規 | `src/app/api/og-ranking/route.tsx` | ランキング用OGP画像生成API |
| 修正 | `src/lib/jsonld.ts` | ランキング用JSON-LD関数追加 |

## 変更しないファイル
- `src/app/api/daily-post/route.ts` — ツイート内容はそのまま
- `src/app/globals.css` — 既存デザイントークンで対応
- 他ページのデザイン — 今回はランキングページ内のみ

## Geminiプロンプト設計（詳細運勢一括生成）

12星座分の運勢を1リクエストで生成。JSON形式で返却を指定:

```
{
  "牡羊座": {
    "work": "◎", "love": "○", "money": "△",
    "lucky_color": "赤", "lucky_item": "手帳", "lucky_time": "午前中",
    "detail": "仕事で新しいチャンスが巡ってきそう。積極的に声をかけてみて。"
  },
  ...
}
```

ルール: work/love/moneyは◎○△のいずれか、detail は50文字以内、絵文字不使用。

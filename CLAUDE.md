# 占処（うらないどころ） - AI占いサイト

## プロジェクト概要
Gemini APIを使ったAI占いWebアプリ。レトロネオンなデザインで6種類の占いを提供。

- 本番URL: https://uranaidokoro.com
- GitHub: moumuri123123-sudo/ai-uranai
- ホスティング: Vercel

## 技術スタック
- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Gemini API (`@google/genai`, gemini-2.5-flash)
- Vercelデプロイ

## コマンド
```bash
npm run dev    # 開発サーバー起動
npm run build  # ビルド
npm run start  # 本番サーバー起動
npm run lint   # ESLint
```

## ディレクトリ構成
```
src/
├── app/
│   ├── api/
│   │   ├── fortune/     # 占いAPI（Gemini呼び出し）
│   │   └── og-result/   # OGP画像生成API
│   ├── tarot/           # タロット占い
│   ├── zodiac/          # 星座占い
│   ├── compatibility/   # 相性占い
│   ├── mbti/            # MBTI診断
│   ├── dream/           # 夢占い
│   ├── numerology/      # 数秘術
│   ├── blog/            # ブログ記事
│   ├── history/         # 占い履歴
│   ├── share/           # シェアページ
│   ├── terms/           # 利用規約
│   ├── privacy/         # プライバシーポリシー
│   ├── about/           # サイト概要
│   ├── contact/         # お問い合わせ
│   ├── layout.tsx       # ルートレイアウト
│   ├── page.tsx         # トップページ
│   ├── globals.css      # グローバルCSS
│   ├── sitemap.ts       # サイトマップ生成
│   └── not-found.tsx    # 404ページ
├── components/
│   ├── ChatBox.tsx      # チャットUI（ストリーミング対応）
│   ├── ChatMessage.tsx  # チャットメッセージ表示
│   ├── Header.tsx       # サイトヘッダー
│   ├── AdBanner.tsx     # AdSense広告枠
│   ├── DailyFortune.tsx # デイリー運勢
│   ├── DailyFortuneShare.tsx
│   ├── FortuneIcon.tsx  # 占いアイコン
│   └── ShareButtons.tsx # SNSシェアボタン
├── lib/
│   ├── blog-data.ts     # ブログ記事データ
│   ├── daily-fortune.ts # デイリー運勢ロジック
│   ├── fortune-data.ts  # 占いデータ定義
│   ├── history.ts       # 履歴管理（localStorage）
│   ├── jsonld.ts        # JSON-LD構造化データ
│   ├── result-card-canvas.ts # 結果カード画像生成
│   └── share-utils.ts   # シェア用ユーティリティ
```

## デザイン
- テーマ: レトロネオン「占処」
- 配色: 黒(#0a0408) + ネオンレッド(#ff2d55) + ゴールド(#ffd700) + ベージュ(#f5e6d0)
- フォント: Shippori Mincho B1（見出し）、Zen Maru Gothic（本文）、Yuji Syuku（装飾）
- 和風レトロな雰囲気を崩さないこと

## 環境変数
```
GEMINI_API_KEY=        # Gemini APIキー（必須）
NEXT_PUBLIC_GA_ID=     # Google Analytics 4（任意）
```

## git push前の必須チェック
- **APIキー・シークレットの漏洩確認を必ず行うこと**
- `git diff --cached` でステージ済みの変更を確認し、以下が含まれていないことをチェック:
  - `GEMINI_API_KEY` の値
  - その他APIキー、トークン、パスワード
  - `.env` / `.env.local` ファイル自体
- 少しでも怪しい文字列があればコミットしない

## 注意事項
- 占い結果にはAI免責注意書きを必ず表示する
- AdBannerには「スポンサーリンク」ラベルを付ける
- MBTI®は登録商標表記が必要
- CSPヘッダーはnext.config.tsで管理（Google AdSense/Analytics許可済み）
- 占い履歴はlocalStorageに保存（サーバーDB不使用）
- チャット入力は500文字制限
- APIにはレート制限あり

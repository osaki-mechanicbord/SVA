# SVA - Special Vehicle Assist

## Project Overview
- **Name**: SVA (Special Vehicle Assist)
- **Goal**: 特殊車両専門の装置取付B2Bプラットフォーム。検索1位獲得のためのSEO/LLMO最適化。
- **Tech Stack**: Hono + TypeScript + TailwindCSS (CDN) + Cloudflare Pages + D1 Database

## URLs
- **Production**: https://sva-7zj.pages.dev (Cloudflare Pages)
- **Custom Domain**: https://sva-assist.com
- **GitHub**: https://github.com/osaki-mechanicbord/SVA

## Features (Completed)

### Public Pages
- **Top Page** (`/`) - ヒーロー、サービス紹介、対応車両、取付装置、FAQ、お問い合わせフォーム
- **車種別サービスページ** (`/service/:slug`) - 6車種対応
  - `/service/forklift` - フォークリフト用AIカメラ・ドラレコ取付
  - `/service/heavy-equipment` - 重機用人検知AIカメラ取付
  - `/service/construction` - 建機停止装置AIカメラ取付
  - `/service/truck` - トラック用ドラレコ・デジタコ・ETC取付
  - `/service/bus` - バス用置き去り防止装置・ドラレコ取付
  - `/service/ship` - 船舶用ドライブレコーダー取付
- **Column** (`/column`, `/column/:slug`) - SEOコラム記事一覧・詳細
- **Legal Pages** (`/privacy`, `/terms`, `/tokushoho`, `/sitemap`)

### CMS Admin (`/admin`)
- 記事管理 (CRUD + 画像挿入 + HTML本文エディタ)
- 画像管理 (Supabase Storage連携)
- パートナー管理
- 案件管理 (ステータス管理・写真ギャラリー)
- 製品マスタ管理
- お問い合わせ管理 (未読バッジ・既読管理)
- 写真ギャラリー
- アカウント設定
- **スマフォ対応**: モバイルボトムナビゲーション (iOS風5タブ + その他メニュー)

### Partner System
- パートナーログイン (`/partner/login`)
- パートナーマイページ (`/partner/mypage`)
- 招待制登録 (`/partner/invite/:token`)

### SEO / LLMO
- `robots.txt` - Google + AI Crawler (GPTBot, Claude, Perplexity等) 完全対応
- `sitemap.xml` - 動的生成 (サービスページ + コラム記事含む)
- `/sitemap` - HTML版サイトマップ
- `llms.txt` - Anthropic標準準拠のLLM向けサマリー
- `llms-full.txt` - LLM向け詳細全文情報
- `ai.txt` - AI引用ポリシー
- 構造化データ (Organization, Service, FAQPage, HowTo, BreadcrumbList, WebSite, WebPage)
- OG画像 + Twitter Card対応

## Data Architecture
- **Database**: Cloudflare D1 (SQLite)
  - articles (コラム記事)
  - inquiries (お問い合わせ)
  - partners (パートナー)
  - jobs (案件)
  - products (製品マスタ)
  - photos (施工写真)
- **Image Storage**: Supabase Storage
- **Static Assets**: Cloudflare Pages (`/public/static/`)

## Development

```bash
npm install
npm run build
npm run dev:d1   # D1 ローカル開発サーバー

# Database
npm run db:migrate:local  # ローカルマイグレーション
npm run db:seed           # テストデータ投入
npm run db:reset          # DB リセット

# Deploy
npm run deploy            # Cloudflare Pages デプロイ
```

## Deployment
- **Platform**: Cloudflare Pages
- **Project Name**: sva
- **Status**: Active
- **Last Updated**: 2026-03-16

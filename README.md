# PokeCalc - ポケモンダメージ計算機

高度な検索機能と自動計算を備えたポケモンバトル計算アプリケーション。チーム管理、努力値(EV)カスタマイズ、リアルタイムチャット機能を提供し、サブスクリプション課金システムを搭載。

## 主な機能

- **ダメージ計算**: 詳細なポケモンバトルダメージ計算
- **チーム管理**: ポケモンチームの作成・編集・共有
- **努力値カスタマイズ**: ドラッグ&ドロップによる直感的なEV調整
- **リアルタイムチャット**: フレンド機能とグループ連携
- **サブスクリプション**: Stripe連携による課金システム
- **画像統合**: yakkun.comからのポケモン画像と色違い表示
- **高度検索**: ひらがな・ローマ字入力対応

## 技術スタック

### フロントエンド
- **React 18** - UIフレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - スタイリング
- **Radix UI** - アクセシブルなUIコンポーネント
- **Framer Motion** - アニメーション
- **TanStack Query** - データフェッチング
- **Wouter** - ルーティング

### バックエンド
- **Node.js** - サーバーランタイム
- **Express** - Webフレームワーク
- **PostgreSQL** - データベース
- **Drizzle ORM** - データベースアクセス
- **Stripe** - 決済処理

### 外部サービス
- **Firebase** - 認証・リアルタイムデータベース
- **yakkun.com** - ポケモン画像API

## セットアップ

### 前提条件
- Node.js 18以上
- PostgreSQL
- Firebase プロジェクト
- Stripe アカウント

### インストール

1. リポジトリをクローン
```bash
git clone [your-repo-url]
cd pokecalc
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
以下の環境変数を設定してください：

```bash
# データベース
DATABASE_URL=your_postgresql_url

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Stripe
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...
```

4. データベースセットアップ
```bash
npm run db:push
```

5. 開発サーバー起動
```bash
npm run dev
```

ブラウザで `http://localhost:5000` にアクセス

## 🚀 デプロイ方法

### 1. Vercel（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/pokecalc)

1. GitHubにリポジトリをアップロード
2. [Vercel](https://vercel.com/) でアカウント作成
3. GitHubリポジトリを接続
4. 環境変数を設定
5. 自動デプロイ開始

**必要な環境変数:**
```
DATABASE_URL=your_postgres_url
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=pokecalc-121d3  
VITE_FIREBASE_APP_ID=your_firebase_app_id
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...
```

### 2. Netlify

1. GitHubにリポジトリをアップロード
2. [Netlify](https://netlify.com/) でアカウント作成
3. 「New site from Git」を選択
4. GitHubリポジトリを接続
5. ビルド設定とデプロイ

### 3. Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/pokecalc)

1. [Railway](https://railway.app/) でアカウント作成
2. 「Deploy from GitHub repo」を選択
3. 環境変数を設定
4. PostgreSQLサービスを追加

### 4. Docker（任意のクラウド）

```bash
# イメージをビルド
docker build -t pokecalc .

# コンテナを起動
docker-compose up -d
```

### 5. 手動デプロイ

```bash
# ビルド
npm run build

# 本番サーバー起動
npm start
```

## プロジェクト構成

```
├── client/                 # フロントエンドコード
│   ├── src/
│   │   ├── components/     # Reactコンポーネント
│   │   ├── hooks/          # カスタムフック
│   │   ├── lib/            # ユーティリティ
│   │   └── pages/          # ページコンポーネント
├── server/                 # バックエンドコード
│   ├── index.ts           # サーバーエントリーポイント
│   ├── routes.ts          # APIルート
│   └── storage.ts         # データアクセス層
├── shared/                 # 共通型定義
│   └── schema.ts          # データベーススキーマ
└── package.json           # 依存関係とスクリプト
```

## 🔧 即座にデプロイする手順

### GitHubアップロード後の自動デプロイ

1. **GitHubにアップロード**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Vercelで即座にデプロイ**
   - [vercel.com](https://vercel.com/) にアクセス
   - 「New Project」をクリック
   - GitHubリポジトリを選択
   - **Framework Preset**: "Other" を選択
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - 環境変数を追加（下記参照）
   - 「Deploy」をクリック
   - 3-5分で公開完了

3. **必要な環境変数（Vercelダッシュボードで設定）**
   ```
   DATABASE_URL → Neon/Supabase等のPostgreSQLサービス
   VITE_FIREBASE_API_KEY → Firebase設定から取得
   VITE_FIREBASE_PROJECT_ID → pokecalc-121d3
   VITE_FIREBASE_APP_ID → Firebase設定から取得
   STRIPE_SECRET_KEY → Stripe秘密キー
   VITE_STRIPE_PUBLIC_KEY → Stripe公開キー
   ```

### 無料サービスでの完全デプロイ

- **フロントエンド**: Vercel/Netlify（無料）
- **データベース**: Neon/Supabase（無料枠）
- **認証**: Firebase（無料枠）
- **決済**: Stripe（手数料のみ）

**合計コスト**: 基本無料（利用量に応じて従量課金）

## API キー取得方法

### Firebase
1. [Firebase Console](https://console.firebase.google.com/) でプロジェクト作成
2. プロジェクト設定から設定値を取得
3. Authentication でメール/パスワード認証を有効化
4. Firestore データベースを作成

### Stripe
1. [Stripe Dashboard](https://dashboard.stripe.com/) でアカウント作成
2. API キーページから公開キーと秘密キーを取得
3. 商品とサブスクリプションプランを設定

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## サポート

問題が発生した場合は、GitHubのIssuesページでお知らせください。
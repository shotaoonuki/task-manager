# 📝 タスク管理アプリ（JWT 認証 + AI サブタスク生成 対応）

## 🔍 採用担当の方向け（このアプリで分かる私のスキル）

- フロント〜バック〜DB〜認証〜AI統合〜CI/CDまで **すべて一人で自走して構築**
- **OpenAI API を Spring Boot に統合し、AI サブタスク生成機能を実装**
- JWT 認証／SecurityFilter／Token 検証など、**実務レベルのセキュリティ知識を伴った開発が可能**
- React × TypeScript の **型安全な UI / ロジック設計**
- Docker Compose により **本番環境と一致したローカル開発環境を構築**
- GitHub Actions（CI）＋ Render / Cloudflare（CD）で **継続的デリバリーの自動化を実現**
- 開発（develop）と本番（main）でブランチを分離し、**実務同様の開発フローを再現**

**React × TypeScript × Spring Boot × PostgreSQL × JWT × Docker × Cloudflare Pages × Render × OpenAI API**

フルスタックとして必要な領域をすべて網羅し、  
**現場で即戦力になる技術**を意識したポートフォリオです。

---

## 🌐 アプリURL

### 🔵 フロントエンド（Cloudflare Pages）
https://task-manager-7k8.pages.dev

### 🟠 バックエンド（Render / Docker）
https://task-manager-uylj.onrender.com

---

## ✨ アプリ概要

タスクの **登録 / 編集 / 削除 / 完了管理 / 優先度 / 締切管理 / ソート / フィルタリング** が可能なタスク管理アプリです。

今回のアップデートでは、以下を新たに実装しました。

- **JWT 認証（ログイン / 新規登録 / 認証付きタスクAPI）**
- **AI サブタスク自動生成（OpenAI API 連携）🆕**
- **ゲストモード（ログイン不要で試せる）**


---

# 🤖 AI サブタスク生成（OpenAI API 連携）【新機能】

## ✔ 概要  
タスク名を入力すると、OpenAI API を呼び出し、  
**関連するサブタスク案を自動生成**します。

例）  
「引越しの準備」と入力すると…

- 荷物の仕分け  
- 不用品の処分  
- 住所変更手続き  

などを AI が生成し、ユーザーはそのまま登録できます。

## ✔ 技術的ポイント  
- OpenAI API（Chat Completions）を **Spring Boot からサーバー側で呼び出し**
- Token / モデル / レスポンス整形などをバックエンドで完結  
- API Key は環境変数で管理し、GitHub に push しないセキュアな構造  
- フロントは `/api/ai/subtasks` のみを呼び出すため安全  

---

## 🤖 AI活用（Cursor）による高速開発

本プロジェクトでのAI機能追加は、生成AI開発環境 **Cursor** を積極的に活用し、
以下の点で開発効率と品質を向上させています。

- **AIによるコードレビュー・リファクタ提案**を受けて品質を強化
- フロント／バック間のデータ仕様や API 設計を  
  **AIと対話しながら整合性チェック**
- バグ調査・改善ポイントの抽出を  
  **AIアシスタントと高速に進行**

---
  

# 🔐 JWT 認証機能（既存実装）

### ✔ 新規登録
- メール & パスワードで登録  
- BCrypt でパスワードを安全に保存  
- 登録後すぐに **JWT を自動発行**

### ✔ ログイン
- 認証成功で JWT を返却  
- フロントは localStorage に保存  
- axios が自動で `Authorization: Bearer <token>` を付与

### ✔ 認証必須 API
- タスク取得・作成・更新・削除（すべて JWT 必須）

### ✔ ゲストモード
ログインしていない場合は `/api/tasks/public` を自動利用。  
採用担当者でもすぐ試せる仕様。

---

## 🚀 使用技術

### 🖥 フロントエンド
- React 18  
- TypeScript  
- Vite  
- Tailwind CSS  
- react-hot-toast  
- Custom Hooks（useTasks）
- LocalStorage 管理  
- **AI サブタスク生成 UI（新実装）🆕**
- **Cloudflare Pages（本番 CI/CD）**

### 🔧 バックエンド
- Java 17  
- Spring Boot 3  
- Spring Web / Spring Data JPA  
- PostgreSQL  
- REST API  
- **OpenAI API（Chat Completions）🆕**
- Docker 化（Render）

### 🔐 セキュリティ
- `JwtAuthenticationFilter` による Token 検証  
- `JwtUtil` による Token 発行・署名  
- CORS 設定（ローカル / 開発 / 本番すべて許可）  
- Stateless セッション管理

### 🗄 データベース
- PostgreSQL（Render Managed DB）

### 🐳 デプロイ
- Docker Compose  
- GitHub Actions（CI）  
- Render Deploy Hook（CD）  
- Cloudflare Pages（フロント）

---

# 🏗 主な機能

## ■ 認証
- 新規登録 / ログイン / ログアウト  
- JWT 自動付与  
- ユーザーごとのタスク分離

## ■ ゲストモード
- ログインせずにすぐ利用可能

## ■ タスク管理
- 追加 / 編集 / 削除 / 完了  
- 締切・優先度  
- ソート / フィルタ  

## ■ AI 機能（新）
- タスク名からサブタスク自動生成  
- 生産性向上を目的とした実用的な AI 連携

---

## 💡 アーキテクチャ構成図（AI対応版）


```
Cloudflare Pages (Frontend - React + TS)
│
├── 未ログイン → /api/tasks/public (ゲストAPI)
├── ログイン → /api/tasks (JWT)
└── AI サブタスク生成 → /api/ai/subtasks (OpenAI)
│
▼
Render (Spring Boot / JWT / OpenAI Integration)
│
▼
PostgreSQL (Render Managed DB)

GitHub Actions（CI）
└─ develop/main でテスト & ビルド
│
├── main → Render Deploy Hook（API 本番）
└── develop → Render Deploy Hook（API 開発）
```


---

## 🔥 技術的こだわり

### ✴️ 1. API Key をフロントに一切触らせない安全設計  
### ✴️ 2. 認証・AI・タスク管理が共存するアーキテクチャ  
### ✴️ 3. サブタスク生成のプロンプト設計も工夫  
### ✴️ 4. 本番環境でも安全に AI を利用できる構成を構築  

---

## 📦 ローカル環境構築

`.env` に以下を追加：
OPENAI_API_KEY=sk-xxxx


### すべてまとめて起動（Docker Compose）
```bash
docker compose up --build
```

### フロントのみ
```bash
cd frontend
npm install
npm run dev
```

### バックエンドのみ
```bash
cd backend/taskapp
./mvnw spring-boot:run
```

---

## 📘 今後の改善予定

- Refresh Token 対応  
- 管理者ロール  
- ダークモード  
- AI によるタスク分類・優先度提案（追加予定）🆕  
- E2E テスト（Cypress / Playwright）

---

## 📄 ライセンス
MIT License

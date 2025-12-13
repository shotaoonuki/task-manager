# 📝 タスク管理アプリ（JWT 認証対応）

## 🔍 採用担当の方向け（このアプリで分かる私のスキル）

- フロント〜バック〜DB〜認証〜CI/CD まで **すべて自走で構築できる**
- JWT 認証／SecurityFilter／Token 検証など、**実務レベルの認証ロジックを理解して実装**
- React × TypeScript の **型安全な設計**（Custom Hooks、型定義、状態管理）
- Docker Compose で **本番と同じ構成のローカル環境**を構築
- GitHub Actions（CI）＋ Render / Cloudflare（CD）で **本番・開発の自動デプロイを構築**
- 開発環境（dev）と本番環境（main）を分離し、実務同様の運用フローを再現
- UI/UX 改善（モーダル、フィルタ、優先度カラー、締切色分けなど）

**React × TypeScript × Spring Boot × PostgreSQL × JWT × Docker × Cloudflare Pages × Render**  
フロント〜バックエンド〜DB〜認証〜CI/CDまで **完全自走で構築したフルスタックアプリケーション** です。

実務で求められる技術（型安全性 / REST API / JWT 認証 / Docker Compose / CI/CD）を意識し、  
ローカル / 開発 / 本番で一貫したアーキテクチャを実現しています。

---

## 🌐 アプリURL

### 🔵 フロントエンド（Cloudflare Pages）
https://task-manager-7k8.pages.dev

### 🟠 バックエンド（Render / Docker）
https://task-manager-uylj.onrender.com

---

## ✨ アプリ概要

タスクの **登録 / 編集 / 削除 / 完了管理 / 優先度 / 締切管理 / ソート / フィルタリング** が可能なタスク管理アプリ。

今回のアップデートで **JWT 認証（ログイン / 新規登録 / 認証付きタスクAPI）** を追加し、  
実務レベルの認証・認可の仕組みを取り入れています。

---

# 🔐 JWT 認証機能（新実装）

### ✔ 新規登録（/auth/register）  
- メール & パスワードで登録  
- BCrypt でパスワードを安全に保存  
- 登録後すぐに **JWT を自動発行**

### ✔ ログイン（/auth/login）  
- 認証成功で JWT を返却  
- フロントは `localStorage` に保存  
- axios が自動で `Authorization: Bearer <token>` を付与

### ✔ 認証必須 API（/api/tasks/**）  
- タスク取得  
- 作成  
- 更新  
- 削除  
→ **すべて JWT が必要**

### ✔ ゲストモード（ログイン不要）  
採用担当者でもすぐ試せるように `/api/tasks/public` を用意。  
ログインしていなければゲスト用タスク、  
ログインすればユーザー専用タスクに自動切替。

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
- **Cloudflare Pages（本番 CI/CD）**

### 🔧 バックエンド

- Java 17  
- Spring Boot 3  
- Spring Web / Spring Data JPA  
- PostgreSQL  
- REST API 設計  
- **Docker 化（Render で稼働）**

## 🔐 セキュリティ（JWT）
- `JwtAuthenticationFilter` による Token 検証  
- `JwtUtil` による Token 発行 / 署名  
- 認証成功時に SecurityContext に User 情報を設定  
- CORS 設定はローカル / 開発 / 本番を全て許可  
- Stateless なセッション管理

### 🗄 データベース

- PostgreSQL（Render マネージド DB）

### 🐳 インフラ / デプロイ

- **Docker Compose（Front / API / DB の完全コンテナ化）**  
- Cloudflare Pages（フロント）  
- Render（API / DB）  
- GitHub Actions（CI）  
- Render Deploy Hook（CD）

---

# 🏗 主な機能

## 🤖 AI によるタスク状態判断（意思決定支援）

本アプリでは、AI を **自動実行ツール**ではなく  
**人間の意思決定を支援するアシスタント**として組み込んでいます。

### 🔁 AI意思決定フロー

1. ユーザーがタスクに対して「🤖 AIに相談」をクリック
2. バックエンドで AI が以下の情報を元に判断
   - タスク名
   - 優先度
   - 締切日
   - 現在の状態（PENDING / EXECUTING / DONE）
3. AI が「次に取るべき状態」と理由を JSON で返却
4. ユーザーが内容を確認し、「この提案を反映」をクリック
5. タスク状態が更新され、UI / DB に即時反映

### 🧠 設計思想（重要）

- ❌ AI による自動状態変更は行わない
- ✅ **必ず人間が承認してから反映**
- ✅ 業務アプリに求められる「説明可能性・安全性」を重視
- AIの判断結果（提案状態・理由）はすべてDBに保存し、
  後から判断理由を追跡できる設計にしています。

### 📦 AIレスポンス例

### 🤖 AI判断ログ（監査・説明可能性）

- AI の提案内容はすべて DB に保存
- 人間が承認したかどうかに関わらず履歴を保持
- 業務利用を想定し、判断根拠を後から確認可能

（task_id / suggested_state / reason / created_at）

### 🧠 AIプロンプト設計

- JSONのみ返却
- 状態遷移を厳密に制限
- DONE 状態は絶対に変更しない
- 判断理由は日本語で簡潔に


```json
{
  "nextState": "EXECUTING",
  "reason": "優先度が高く、締切が近いため今すぐ着手すべきと判断しました。"
}
```

## ■ 認証機能
- 新規登録  
- ログイン  
- ログアウト  
- JWT 自動付与  
- 認証ユーザーごとのタスク分離  

## ■ ゲストモード
- ログインしなくてもすぐ利用可能  
- 採用担当者がストレスなく操作できる仕様  

## ■ タスク管理
- 追加 / 編集 / 削除  
- 完了トグル  
- 締切日  
- 優先度  
- ソート / フィルタリング  

## ■ UI
- モーダル  
- ダブルクリック編集  
- 締切の色分け  
- 優先度カラー  
- トースト通知  

---

## 💡 アーキテクチャ構成図

```
Cloudflare Pages (Frontend - React + TS)
│
├── 未ログイン → /api/tasks/public (ゲストAPI)
└── ログイン → /api/tasks (JWT 認証必須)
│
▼
Render (Spring Boot / JWT Authentication)
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

## 🔥 技術的こだわりポイント

### ✴️ 1. JWT を自前実装  
Filter → Token 検証 → SecurityContext の流れを理解して構築。

### ✴️ 2. axios Interceptor で Token 自動付与  
ログイン状態とゲスト状態を自動で切り替え。

### ✴️ 3. Docker Compose で本番と同構成  
ローカル環境がそのまま本番 Render と一致。

### ✴️ 4. CI/CD の完全自動化  
- GitHub Actions → Lint / TypeScript / Java Test  
- Render Deploy Hook（API）  
- Cloudflare Pages → 自動ビルド（フロント）

---

## 📦 ローカル環境構築

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

Refresh Token
ロール（ROLE_USER / ROLE_ADMIN）
ダークモード
例外ハンドリング統一
バリデーション（@Valid）
E2E テスト（Cypress / Playwright）
Tagging / 担当者機能

---

## 📄 ライセンス
MIT License

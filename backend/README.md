# 📝 タスク管理アプリ（JWT 認証対応）

## ⭐ このアプリの最大の特徴

本アプリは  
「AIを業務システムで安全に利用するための設計」  
を最重要テーマとして構築しています。

- AIは最終的な状態変更を自動実行しない
- 人間が内容を確認し、承認した場合のみ反映
- 判断主体はAIに委譲し、人間はレビューに専念
- AIの判断結果はすべてログとして永続化
- 後から「なぜその判断が行われたか」を説明可能

単なる AI 連携デモではなく、  
実務・業務利用を前提とした AI 設計を意識した  
フルスタックアプリケーションです。

---

## 🔍 採用担当の方向け（このアプリで分かる私のスキル）

- フロント〜バック〜DB〜認証〜CI/CD まで すべて自走で構築
- JWT 認証／SecurityFilter／Token 検証など、実務レベルの認証ロジックを理解して実装
- React × TypeScript の型安全な設計（Custom Hooks、型定義、状態管理）
- Docker Compose による本番と同構成のローカル環境
- GitHub Actions（CI）＋ Render / Cloudflare Pages（CD）による自動デプロイ
- develop / main を分離した実務想定フロー
- UI/UX 改善（モーダル、フィルタ、優先度カラー、締切色分けなど）

React × TypeScript × Spring Boot × PostgreSQL × JWT × Docker × Cloudflare Pages × Render  
フロント〜バックエンド〜DB〜認証〜CI/CDまで  
完全自走で構築したフルスタックアプリケーションです。

---

## 🌐 アプリURL

フロントエンド（Cloudflare Pages）  
https://task-manager-7k8.pages.dev

バックエンド（Render / Docker）  
https://task-manager-uylj.onrender.com

---

## ✨ アプリ概要

タスクの  
登録 / 編集 / 削除 / 完了管理 / 優先度 / 締切管理 / ソート / フィルタリング  
が可能なタスク管理アプリです。

JWT 認証（ログイン / 新規登録 / 認証付きタスクAPI）を実装し、  
実務レベルの認証・認可設計を取り入れています。

---

## 🔐 JWT 認証機能

新規登録（/auth/register）  
- メール & パスワードで登録  
- BCrypt によるパスワードハッシュ化  
- 登録後すぐに JWT を自動発行  

ログイン（/auth/login）  
- 認証成功で JWT を返却  
- フロントは localStorage に保存  
- axios Interceptor により Authorization ヘッダを自動付与  

認証必須 API（/api/tasks/**）  
- タスク取得 / 作成 / 更新 / 削除  
- すべて JWT 必須  

ゲストモード  
- 未ログインでも利用可能  
- /api/tasks/public を用意  
- ログイン状態に応じて API を自動切替  

---

## 🤖 AIによるタスク状態判断（業務利用を想定した設計）

AIはタスク状態を自動で変更せず、  
人間の意思決定を支援する役割として組み込んでいます。

AIによるタスク状態判断

### AI意思決定フロー

1. ユーザーが「🤖 AIに相談」をクリック  
2. AI が以下を元に判断  
   - タスク名  
   - 優先度  
   - 締切日  
   - 現在の状態（PENDING / EXECUTING / DONE）  
3. AI が次に取るべき状態と理由を返却  
4. ユーザーが内容を確認し「この提案を反映」をクリック  
5. タスク状態を更新  

---

## 🧠 設計思想（重要）

- AIによる自動状態変更は行わない
- 必ず人間が承認してから反映
- AIの判断結果はすべてDBに保存
- 後から判断理由を追跡可能

業務システムでは  
「AIがそう言ったから」では説明責任を果たせないため、  
AIを意思決定支援ツールとして位置づけています。

---

## 📜 AI判断ログ（監査・説明可能性）

AI の提案内容はすべて DB に保存し、  
人間が承認したかどうかに関わらず履歴を保持します。

ログ項目  
- task_id  
- suggested_state  
- reason  
- created_at  

ログ取得 API  
GET /api/tasks/{taskId}/ai/logs  
Authorization: Bearer <JWT>

---

## 🧠 AIプロンプト設計

- JSON 形式のみ返却
- 状態遷移を厳密に制限
- DONE 状態は変更不可
- 判断理由は日本語で簡潔に出力

レスポンス例  
  {
    "nextState": "EXECUTING",
    "reason": "優先度が高く、締切が近いため今すぐ着手すべきと判断しました。"
  }

---

## 🐳 インフラ / デプロイ構成

- Docker Compose（Front / API / DB）
- Cloudflare Pages（Frontend）
- Render（API / PostgreSQL）
- GitHub Actions（CI）
- Render Deploy Hook（CD）

---

## 📦 ローカル環境構築

すべて起動  
docker compose up --build

フロントのみ  
cd frontend  
npm install  
npm run dev  

バックエンドのみ  
cd backend/taskapp  
./mvnw spring-boot:run  

---

## 📘 今後の改善予定

- Refresh Token 対応  
- 権限管理（ROLE_USER / ROLE_ADMIN）  
- AI判断ログへの userId 付与  
- 例外ハンドリング統一  
- バリデーション強化  
- E2E テスト（Cypress / Playwright）  
- タグ・担当者機能  

---

## 📄 ライセンス

MIT License

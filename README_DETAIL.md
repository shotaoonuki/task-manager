# 📘 README_DETAIL.md
## タスク管理アプリ 技術詳細・設計思想ドキュメント

本ドキュメントは、本アプリケーションにおける **技術選定・設計判断・責務分離・AI設計思想** を、エンジニア向けに詳細に説明するための資料です。

---

## 🎯 設計全体のゴール

- 実務・業務システムでそのまま使える設計
- 将来的な拡張（権限管理 / 監査 / AI高度化）に耐えられる構成
- 「なぜこの設計にしたか」を説明できること

---

## 🧱 全体アーキテクチャ

[ React + TypeScript ]  
│  
│ JWT (Authorization Header)  
▼  
[ Spring Boot API ]  
├─ Controller  
├─ Service  
├─ Repository  
├─ Security (JWT Filter)  
└─ OpenAI Service  
│  
▼  
[ PostgreSQL ]

---

## 🔐 JWT 認証設計

### 採用理由
- Stateless な API を実現
- フロントエンド / バックエンド分離構成と相性が良い
- 業務システムで一般的な構成

### 認証フロー
1. ログイン / 新規登録  
2. JWT 発行  
3. axios Interceptor により全 API リクエストに自動付与  
4. JwtAuthenticationFilter でトークン検証  
5. 認証成功時に SecurityContext に User 情報を設定  

### 設計ポイント
- セッションは保持しない（Stateless）
- 認証ロジックは Filter に集約
- Controller / Service は認証を意識しない設計

---

## 🧠 AI 機能の設計思想（最重要）

### ❌ 採用しなかった設計
- AI による自動状態変更
- AI の判断を即時 DB に反映
- 判断理由を保存しない構成

### ✅ 採用した設計
- AI は判断提案のみ
- 実行可否は必ず人間が判断
- AI の判断結果はすべてログとして永続化

---

## 🤖 AI意思決定フロー（詳細）

User  
↓  
「🤖 AIに相談」  
↓  
TaskAiDecisionController  
↓  
TaskAiDecisionService  
├─ buildPrompt()  
├─ OpenAIService.chat()  
├─ fallback()  
└─ saveLog()  
↓  
レスポンス返却  
↓  
User が確認・承認  
↓  
状態更新 API 実行  

---

## 🧩 クラス責務設計

### TaskAiDecisionController
- HTTP リクエスト受付のみ
- 認証済み前提
- ビジネスロジックを持たない

### TaskAiDecisionService
- AI判断の中核ロジック
- プロンプト生成
- AIレスポンスのパース
- フォールバック処理
- AI判断ログ保存

### OpenAIService
- OpenAI API との通信を完全に隠蔽
- 他 Service から直接 API を触らせない
- 将来的なモデル変更・差し替えを容易にする

---

## 🧠 プロンプト設計方針

- JSON 形式のみ返却
- 状態遷移を列挙で制限
- DONE 状態は変更不可
- 判断理由は日本語で簡潔

### プロンプト例

You are a task management AI.  
Return ONLY valid JSON.  

Allowed nextState values: PENDING, EXECUTING, DONE  

Rules:  
- If already DONE, keep DONE.  
- Prefer EXECUTING if priority is high and dueDate is near.  
- Provide a concise Japanese reason.  

---

## 🛡 フォールバック設計（実務的配慮）

AI が失敗しても業務は止めない。

想定エラー  
- OpenAI API エラー  
- JSON パース失敗  
- 想定外レスポンス  

すべて catch し、ルールベースのロジックで必ず結果を返す。

例:  
PENDING かつ HIGH 優先度 → EXECUTING

---

## 📜 AI判断ログ設計（監査・説明責任）

保存対象  
- task_id  
- suggested_state  
- reason  
- created_at  

保存タイミング  
- AI 成功時  
- AI 失敗時（フォールバック含む）  

設計意図  
- AIがなぜその判断をしたかを後から説明可能  
- 監査・レビュー用途  
- AI精度改善のための履歴データ  

---

## 📡 AI判断ログ API

GET /api/tasks/{taskId}/ai/logs  
Authorization: Bearer <JWT>  

- タスク単位で履歴取得  
- 時系列降順  
- UI 側で折りたたみ表示  

---

## 🎨 フロントエンド設計ポイント

- 状態管理は極力ローカル + Custom Hook
- API 層は完全分離
- AI 機能は TaskItem に閉じ込める
- UI 操作と副作用を明確に分離

---

## 🐳 Docker / CI/CD 設計

- Docker Compose で本番同構成
- Cloudflare Pages：Frontend
- Render：API / PostgreSQL
- GitHub Actions：Lint / Build / Test

---

## 🚀 今後の拡張を見据えた設計

- Refresh Token 対応
- Role / Permission 管理
- AI判断ログへの userId 付与
- AIモデル差し替え
- E2E テスト追加

---

## 🧠 総括

本アプリは「AIを使ったアプリ」ではなく、  
**AIを業務で安全に使うための設計例**です。

説明責任・監査可能性・人間中心の意思決定を重視した構成としています。

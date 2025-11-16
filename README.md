# 📝 タスク管理アプリ（Task Manager App）

フロントエンド・バックエンド・データベース・CI/CD まで  
**Web アプリケーション開発の一連の流れを自走して構築したアプリケーション** です。

実務で求められる技術（型安全性 / REST API / Docker / CI/CD）を意識して、  
フロントからインフラ構成まで一貫して開発しています。

---

## 🌐 アプリURL

### 🔵 フロントエンド（Vercel）
https://task-manager-portfolio-v2.vercel.app/

### 🟠 バックエンド（Render）
https://task-manager-portfolio-v2.onrender.com

---

## ✨ アプリ概要

タスクの登録・編集・削除・優先度設定・締切管理、モーダル表示、  
サーバー同期など、**実務レベルを意識した機能**を搭載しています。

UI / UX を向上させるために、コンポーネント分割・カスタムフックなど、  
React のベストプラクティスを採用しています。

---

## 🚀 使用技術

### 🖥 フロントエンド
- React 18
- TypeScript
- Vite
- Tailwind CSS
- react-hot-toast（通知）
- Custom Hooks（useTasks）
- LocalStorage 連携

### 🔧 バックエンド
- Java 17
- Spring Boot 3
- Spring Web / Spring Data JPA
- PostgreSQL
- REST API 設計

### 🗄 データベース
- PostgreSQL（Render のマネージドDB）

### 🐳 インフラ / デプロイ
- **Render（Docker デプロイ）**
- Vercel（フロント）
- GitHub Actions（CI）
- Render Deploy Hook（CD）

---

## 🏗 アプリの主な機能

### ◾️ タスク機能
- タスクの追加 / 削除 / 編集
- 完了・未完了トグル
- 締切日の登録と色分け表示
- 優先度（高・中・低）

### ◾️ UI & 操作性
- モーダルで詳細表示
- ダブルクリックで編集モード
- ソート（締切順、優先度順）
- フィルタ（すべて / 未完了 / 完了）
- カスタムフックでロジック分離

### ◾️ サーバー連携
- API と同期ボタン
- LocalStorage → サーバー同期

---

## 💡 アーキテクチャ構成図（テキスト版）

Vercel (React + TypeScript)
│
▼
REST API (Spring Boot)
│
▼
PostgreSQL (Render)


CI（GitHub Actions）

push →
├─ Java テスト実行
└─ main の場合 → Render Deploy Hook に POST → 自動デプロイ


---

## 🔥 技術的なこだわりポイント

### ✴️ 1. TypeScript による型安全なフロントエンド
コンポーネントの props / API / タスクリストなどすべて型定義し、  
**実務レベルの保守性・可読性** を実現。

### ✴️ 2. useTasks カスタムフックでロジック分離
タスク操作ロジックを 1 つのフックに集約し、  
UI ロジックとビジネスロジックの分離を徹底。

### ✴️ 3. Spring Boot × PostgreSQL による堅牢な API
- JPA によるエンティティ・永続化
- Controller / Service / Repository の三層構造
- Render に Docker デプロイ

### ✴️ 4. CI/CD を完全自動化
- GitHub Actions で自動テスト
- main push で Render 自動デプロイ（Deploy Hook）
- 人間の「ミス」を排除したプロセス

### ✴️ 5. Docker による本番同等環境の構築
Render の Dockerfile を利用し、  
**ローカルと本番がズレない構成** を実現。

---

## 📦 環境構築

### フロントエンド
cd frontend
npm install
npm run dev


### バックエンド
cd backend/taskapp
./mvnw spring-boot:run



---

## 📘 今後の改善予定

- Docker Compose により、**Front / API / DB** の完全コンテナ化
- バリデーション強化（@Valid）
- エラーレスポンス統一（ExceptionHandler）
- タグ機能 / 担当者機能
- UI ライブラリ（Shadcn / Radix UI）導入
- E2E テスト導入（Playwright / Cypress）

---

## 📄 ライセンス
MIT License


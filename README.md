# 📝 Task Manager App（最新構成版）

**React × TypeScript × Spring Boot × PostgreSQL × Docker × Cloudflare Pages × Render**  
フロント〜バックエンド〜DB〜CI/CDまで **完全自走で構築したフルスタックアプリケーション** です。

実務で求められる技術（型安全性 / REST API / Docker Compose / CI/CD）を意識し、  
開発〜本番環境まで一貫したアーキテクチャで設計しています。

---

## 🌐 アプリURL

### 🔵 フロントエンド（Cloudflare Pages）
https://task-manager-7k8.pages.dev

### 🟠 バックエンド（Render / Docker）
https://task-manager-uylj.onrender.com

---

## ✨ アプリ概要

タスクの **登録 / 編集 / 削除 / 完了管理 / 優先度 / 締切管理 / ソート / フィルタリング** など、  
実務想定の要件を満たすタスク管理アプリです。

UI/UX の品質にもこだわり、  
React のベストプラクティクス（Hooks、カスタムフック、型定義）を積極採用しています。

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

### 🗄 データベース

- PostgreSQL（Render マネージド DB）

### 🐳 インフラ / デプロイ

- **Docker Compose（Front / API / DB の完全コンテナ化）**  
- Cloudflare Pages（フロント）  
- Render（API / DB）  
- GitHub Actions（CI）  
- Render Deploy Hook（CD）

---

## 🏗 主な機能

### ■ タスク機能
- 追加 / 編集 / 削除  
- 完了・未完了トグル  
- 締切日の登録（締切が近づくと色分け）  
- 優先度（高・中・低）

### ■ UI / 操作性
- モーダル表示  
- ダブルクリック編集  
- ソート（締切順 / 優先度順）  
- フィルタ（全て / 未完了 / 完了）

### ■ サーバー連携
- 「同期」ボタンで LocalStorage → API  
- オフライン時でも操作可能  

---

## 💡 アーキテクチャ構成図（最新）

```
Cloudflare Pages (React + TypeScript)
│
▼
REST API (Spring Boot / Docker / Render)
│
▼
PostgreSQL (Render)

GitHub Actions（CI）
└─ Java テスト → main push → Render Deploy Hook → 自動デプロイ（CD）
```

---

## 🔥 技術的こだわりポイント

### ✴️ 1. TypeScript による型安全設計
API 型 / Props / Task 型をすべて定義し、実務レベルの保守性を確保。

### ✴️ 2. useTasks によるロジック分離
UI とビジネスロジックを分離し、React の設計原則に従った構造に。

### ✴️ 3. Spring Boot × JPA の三層構造
Controller / Service / Repository による堅牢で拡張性の高い構成。

### ✴️ 4. CI/CD の自動化
- GitHub Actions → Java テスト（CI）  
- main push → Render Deploy Hook（CD）  
- Cloudflare Pages によるフロント自動ビルド  
- **デプロイのミスゼロ化**

### ✴️ 5. Docker Compose による本番同等環境
frontend / backend / db をコンテナで統一し、  
本番 Render（Docker）との構成差異をゼロに。

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

- UI ライブラリ（Shadcn / Radix UI）  
- 例外ハンドリング統一（ExceptionHandler）  
- バリデーション追加（@Valid）  
- E2E Test（Playwright / Cypress）  
- タグ / 担当者機能  
- ダークモード対応  

---

## 📄 ライセンス
MIT License

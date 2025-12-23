import axios from "axios";

// 開発環境では直接バックエンドURLを使用（プロキシの問題を回避）
// 本番環境では環境変数から取得
const getBaseURL = () => {
  // 環境変数が設定されている場合はそれを使用
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // 開発環境では常に直接バックエンドURLを使用
  if (import.meta.env.DEV) {
    return "http://localhost:8080";
  }
  // 本番環境では相対パス（プロキシを使用）
  return "";
};

const baseURL = getBaseURL();
if (import.meta.env.DEV) {
  console.log("🔧 API Base URL:", baseURL || "(プロキシ使用)");
}

const api = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  timeout: 30000, // 30秒のタイムアウト（OpenAI API呼び出しに時間がかかる可能性があるため）
});

// リクエスト前に token を付ける
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // デバッグ用：リクエストURLをログ出力
  if (import.meta.env.DEV) {
    const fullUrl = config.baseURL
      ? `${config.baseURL}${config.url}`
      : config.url;
    console.log("📤 API Request:", config.method?.toUpperCase(), fullUrl);
    if (config.data) {
      console.log("📤 Request Data:", config.data);
    }
  }
  return config;
});

// レスポンスエラーハンドリング
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(
        "✅ API Response:",
        response.config.method?.toUpperCase(),
        response.config.url,
        response.status
      );
    }
    return response;
  },
  (error) => {
    // AbortControllerによるキャンセルは正常な動作なので、エラーとして扱わない
    if (
      error.code === "ERR_CANCELED" ||
      error.name === "AbortError" ||
      error.message === "canceled"
    ) {
      if (import.meta.env.DEV) {
        console.log("🚫 Request canceled (正常な動作)");
      }
      return Promise.reject(error);
    }

    if (import.meta.env.DEV) {
      const fullUrl = error.config?.baseURL
        ? `${error.config.baseURL}${error.config.url}`
        : error.config?.url;
      console.error("❌ API Error:", {
        url: fullUrl,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code,
        name: error.name,
      });
    }
    return Promise.reject(error);
  }
);

export default api;

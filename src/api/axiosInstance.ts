import axios from "axios";

const BASE_URL = "http://localhost:8080/api"; // ←ローカルならこれ

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

// 共通エラーハンドリング（オプション）
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err);
    return Promise.reject(err);
  }
);

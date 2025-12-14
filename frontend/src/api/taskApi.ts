import api from "./axiosInstance";
import type { TaskItem } from "../types/task";

export async function getTasks(): Promise<TaskItem[]> {
  const res = await api.get("/api/tasks");
  return res.data;
}

export async function addTask(task: Partial<TaskItem>): Promise<TaskItem> {
  const res = await api.post("/api/tasks", task);
  return res.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/api/tasks/${id}`);
}

export async function updateTask(id: number, task: Partial<TaskItem>): Promise<TaskItem> {
  const res = await api.put(`/api/tasks/${id}`, task);
  return res.data;
}

// AI判断レスポンス型
export interface TaskAiDecisionResponse {
  nextState: "PENDING" | "EXECUTING" | "DONE";
  reason: string;
}

// AIに状態判断を依頼
export async function getTaskAiDecision(
  taskId: number
): Promise<TaskAiDecisionResponse> {
  const res = await api.post(`/api/tasks/${taskId}/ai/decision`);
  return res.data;
}
export async function updateTaskState(
  taskId: number,
  state: "PENDING" | "EXECUTING" | "DONE"
): Promise<TaskItem> {

  const isLoggedIn = !!localStorage.getItem("token");

  const url = isLoggedIn
    ? `/api/tasks/${taskId}/state`
    : `/api/tasks/public/${taskId}/state`;

  const res = await api.put(url, { state });
  return res.data;
}



// AI判断ログ型
export interface AiDecisionLog {
  id: number;
  taskId: number;
  suggestedState: "PENDING" | "EXECUTING" | "DONE";
  reason: string;
  createdAt: string;
}

// AI判断ログ取得
export async function getTaskAiLogs(
  taskId: number
): Promise<AiDecisionLog[]> {
  const isLoggedIn = !!localStorage.getItem("token");

  const url = isLoggedIn
    ? `/api/tasks/${taskId}/ai/logs`
    : `/api/tasks/public/${taskId}/ai/logs`;

  const res = await api.get(url);
  return res.data;
}




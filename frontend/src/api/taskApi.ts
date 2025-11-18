import api from "./axiosInstance";
import type { Task } from "../types/task";

export async function getTasks(): Promise<Task[]> {
  const res = await api.get("/api/tasks");
  return res.data;
}

export async function addTask(task: Partial<Task>): Promise<Task> {
  const res = await api.post("/api/tasks", task);
  return res.data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/api/tasks/${id}`);
}

export async function updateTask(id: number, task: Partial<Task>): Promise<Task> {
  const res = await api.put(`/api/tasks/${id}`, task);
  return res.data;
}

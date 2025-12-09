import api from "./axiosInstance";
import type { Subtask } from "../types/task";

export interface GenerateSubtasksRequest {
  taskTitle: string;
  taskDescription?: string;
}

export async function generateSubtasks(
  taskId: number,
  request: GenerateSubtasksRequest
): Promise<Subtask[]> {
  const res = await api.post(`/api/tasks/${taskId}/subtasks/generate`, request);
  return res.data;
}

export async function getSubtasks(taskId: number, signal?: AbortSignal): Promise<Subtask[]> {
  const res = await api.get(`/api/tasks/${taskId}/subtasks`, {
    signal,
  });
  return res.data;
}

export async function updateSubtask(
  taskId: number,
  subtaskId: number,
  subtask: Partial<Subtask>
): Promise<Subtask> {
  const res = await api.put(`/api/tasks/${taskId}/subtasks/${subtaskId}`, subtask);
  return res.data;
}

export async function deleteSubtask(
  taskId: number,
  subtaskId: number
): Promise<void> {
  await api.delete(`/api/tasks/${taskId}/subtasks/${subtaskId}`);
}


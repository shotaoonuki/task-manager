export type Priority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string | null;
  priority: Priority;
}

export interface Subtask {
  id: number;
  title: string;
  completed: boolean;
  taskId: number;
}

export interface EditData {
  title: string;
  dueDate: string;
  priority: Priority;
}

// frontend/src/types/agent.ts

export type AgentRunStatus =
  | "PLANNING"
  | "EXECUTING"
  | "WAITING_USER_INPUT"
  | "WAITING_FOR_APPROVAL"
  | "COMPLETED"
  | "FAILED"
  | "REJECTED";

export type AgentRun = {
  id: string;
  status: AgentRunStatus;
  taskId: number;
  createdAt: string;
  updatedAt: string;

  // ★ 追加
  contextJson?: string | null;
};

export type AgentPlanCandidate = {
  id: string;
  startDate: string;
  durationDays: number;
  plannedSubtasks?: string[];
};

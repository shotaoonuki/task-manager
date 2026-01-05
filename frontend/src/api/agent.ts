// frontend/src/api/agent.ts

import { AgentPlanCandidate, AgentRun } from "../types/agent";
import { AgentStep } from "../types/AgentStep";
import axios from "./axiosInstance"; // 既存の axiosInstance を使う

export const fetchAgentPlanCandidates = async (
  runId: string
): Promise<AgentPlanCandidate[]> => {
  const res = await axios.get(`/api/agent-runs/${runId}/candidates`);
  return res.data;
};

export const approveAgentPlan = async (runId: string, candidateId: string) => {
  await axios.post(`/api/agent-runs/${runId}/approve/${candidateId}`);
};

export const startAgentRun = async (taskId: number): Promise<string> => {
  const res = await axios.post("/api/agent-runs/start", null, {
    params: { taskId },
  });
  return res.data;
};

export async function fetchAgentRun(runId: string): Promise<AgentRun> {
  const res = await axios.get(`/api/agent-runs/${runId}`);
  return res.data;
}

/**
 * 🤖 Agent の行動ログ取得
 */
// frontend/src/api/agent.ts
export async function fetchAgentSteps(runId: string): Promise<AgentStep[]> {
  const res = await axios.get(`/api/agent-runs/${runId}/steps`);
  return res.data;
}

export async function resumeAgentRun(runId: string): Promise<void> {
  await axios.post(`/api/agent-runs/${runId}/resume`);
}

export const approveAgentRun = async (runId: string) => {
  await axios.post(`/api/agent-runs/${runId}/approve`);
};

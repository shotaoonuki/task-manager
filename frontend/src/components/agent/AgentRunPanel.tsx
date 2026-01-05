import { AgentStepLogPanel } from "./AgentStepLogPanel";
import { AgentPlanApprovalPanel } from "./AgentPlanApprovalPanel";
import { AgentRun } from "../../types/agent";
import { useMemo, useState } from "react";
import { AgentPlanSummary } from "./AgentPlanSummary";

type Props = {
  agentRun: AgentRun;
  onApproved: () => void;
  onResume: () => Promise<void>;
};

export function AgentRunPanel({ agentRun, onApproved, onResume }: Props) {
  const context = useMemo(() => {
    try {
      return agentRun.contextJson ? JSON.parse(agentRun.contextJson) : null;
    } catch {
      return null;
    }
  }, [agentRun.contextJson]);

  return (
    <div className="mt-4">
      {/* ① 思考ログ（常に表示） */}
      <AgentStepLogPanel runId={agentRun.id} status={agentRun.status} />

      {/* ② 追加情報待ち */}
      {agentRun.status === "WAITING_USER_INPUT" && (
        <div className="mt-4 p-4 border rounded bg-yellow-50">
          <div className="font-semibold mb-2">
            🤖 AIが追加情報を待っています
          </div>
          <button
            onClick={() => onResume()}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            再開
          </button>
        </div>
      )}

      {/* ✅ ★ここが今回の追加ポイント */}
      {agentRun.status === "WAITING_FOR_APPROVAL" && (
        <>
          {/* ③ AIが提案した計画（承認対象） */}
          <AgentPlanSummary contextJson={agentRun.contextJson} />

          {/* ④ 承認UI */}
          <AgentPlanApprovalPanel
            agentRunId={agentRun.id}
            onApproved={onApproved}
          />
        </>
      )}

      {/* ⑤ 完了表示 */}
      {agentRun.status === "COMPLETED" && (
        <div className="mt-4 p-4 border rounded bg-green-50 text-green-800">
          ✅ AIによる計画の実行が完了しました
        </div>
      )}
    </div>
  );
}

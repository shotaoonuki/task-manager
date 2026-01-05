// frontend/src/components/agent/AgentPlanApprovalPanel.tsx
import { useEffect, useState } from "react";
import { fetchAgentPlanCandidates, approveAgentPlan } from "../../api/agent";
import { AgentPlanCandidate } from "../../types/agent";

import { approveAgentRun } from "../../api/agent";

type Props = {
  agentRunId: string;
  onApproved: () => void;
};

export const AgentPlanApprovalPanel = ({ agentRunId, onApproved }: Props) => {
  const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  //     fetchAgentPlanCandidates(agentRunId).then(setCandidates);
  //   }, [agentRunId]);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveAgentRun(agentRunId);
      onApproved();
    } catch {
      alert("承認に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, marginTop: 16 }}>
      <h3>🤖 AIの計画を承認しますか？</h3>
      <p style={{ color: "#666", fontSize: 14 }}>
        計画内容（ステップログ）を確認し、問題なければ承認してください。
      </p>

      <button onClick={handleApprove} disabled={loading}>
        承認して進める
      </button>
    </div>
  );
};

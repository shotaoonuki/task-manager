// frontend/src/pages/AgentRunDetailPage.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAgentRun } from "@/api/agent";
import { AgentRun } from "../types/agent";
import { AgentStepLogPanel } from "../components/agent/AgentStepLogPanel";

export default function AgentRunDetailPage() {
  const { runId } = useParams<{ runId: string }>();
  const [run, setRun] = useState<AgentRun | null>(null);

  useEffect(() => {
    if (!runId) return;
    fetchAgentRun(runId).then(setRun);
  }, [runId]);

  if (!run) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Agent Run Detail</h1>

      <div className="mb-4">
        <div>Status: {run.status}</div>
        <div>Run ID: {run.id}</div>
      </div>

      {/* ★ Lv3.5 の本体 */}
      <AgentStepLogPanel runId={run.id} status={run.status} />
    </div>
  );
}

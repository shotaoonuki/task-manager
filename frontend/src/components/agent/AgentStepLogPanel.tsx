import { AgentRunStatus } from "../../types/agent";
import { AgentStep } from "../../types/AgentStep";
import { fetchAgentSteps } from "../../api/agent";
import { useEffect, useState } from "react";

type Props = {
  runId: string;
  status: AgentRunStatus;
};
export function AgentStepLogPanel({ runId, status }: Props) {
  const [steps, setSteps] = useState<AgentStep[]>([]);

  useEffect(() => {
    fetchAgentSteps(runId).then(setSteps);
  }, [runId]);

  useEffect(() => {
    const ACTIVE_STATUSES = [
      "PLANNING",
      "EXECUTING",
      "RUNNING",
      "WAITING_FOR_APPROVAL",
    ];

    if (!ACTIVE_STATUSES.includes(status)) return;

    const id = setInterval(() => {
      fetchAgentSteps(runId).then(setSteps);
    }, 3000);

    return () => clearInterval(id);
  }, [runId, status]);

  if (steps.length === 0) return null;

  return (
    <div className="mt-4 border rounded-lg p-3 bg-slate-50">
      <div className="font-semibold mb-2">🤖 AIエージェントの判断ログ</div>

      {/* {steps.map((s) => (
        <div key={s.id} className="text-sm text-gray-700 mb-2">
          [{new Date(s.createdAt).toLocaleTimeString()}]
          <br />
          <b>{s.type}</b>
          <div>📌 {s.message}</div>
        </div>
      ))} */}
      {steps.map((s) => (
        <div key={s.id} className="text-sm text-gray-700 mb-3">
          [{new Date(s.createdAt).toLocaleTimeString()}]
          <div>🤖 {toUserMessage(s)}</div>
        </div>
      ))}
    </div>
  );
}

function toUserMessage(step: AgentStep): string {
  // BUILD_PLAN の多段階ログ
  if (
    step.decisionType === "BUILD_PLAN" &&
    step.observation?.startsWith("STAGE_")
  ) {
    const stageMap: Record<string, string> = {
      STAGE_1: "タスクの内容を整理しています",
      STAGE_2: "あなたの予定を確認しています",
      STAGE_3: "実行できる順番を考えています",
      STAGE_4: "無理のない計画か検証しています",
      STAGE_5: "最終的な計画をまとめています",
    };

    return stageMap[step.observation] ?? "計画を進めています";
  }

  // 判断ログ
  switch (step.decisionType) {
    case "WAIT_FOR_APPROVAL":
      return "計画が完成しました。あなたの承認を待っています";
    case "EXECUTE_PLAN":
      return "計画をカレンダーに登録しています";
    case "COMPLETE":
      return "計画の実行が完了しました";
    default:
      return "AIが処理を進めています";
  }
}

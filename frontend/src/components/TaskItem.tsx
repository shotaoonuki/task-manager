import type {
  TaskItem as TaskItemType,
  Priority,
  EditData,
} from "../types/task";
import { Trash2 } from "lucide-react";
import SubtaskList from "./SubtaskList";
import React, { useEffect, useState } from "react";
import { getTaskAiDecision } from "../api/taskApi";
import { updateTaskState } from "../api/taskApi";
import AiDecisionLogList from "./AiDecisionLogList";
import toast from "react-hot-toast";
import { startAgentRun } from "../api/agent";
import { AgentRun } from ".././types/agent";
import { AgentStep } from ".././types/AgentStep";
import { fetchAgentRun, fetchAgentSteps, resumeAgentRun } from "../api/agent";
import { AgentRunPanel } from "./agent/AgentRunPanel";

type Props = {
  task: TaskItemType;
  editingId: number | null;
  editData: EditData;
  onChangeEditData: (data: EditData) => void;
  onSaveEdit: (task: TaskItemType) => void;
  onCancelEdit: () => void;
  onToggleComplete: (task: TaskItemType) => void;
  onDelete: (id: number) => void;
  onClickTask: (task: TaskItemType) => void;
  priorityColor: Record<Priority, string>;
  getDueDateColor: (dueDate: string | null) => string;
  onRefreshTasks: () => void;
};

export default function TaskItem({
  task,
  editingId,
  editData,
  onChangeEditData,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onClickTask,
  priorityColor,
  getDueDateColor,
  onRefreshTasks,
}: Props) {
  const stateRowStyle: Record<string, string> = {
    PENDING: "bg-white",
    EXECUTING: "bg-blue-50 border-l-4 border-blue-400",
    DONE: "bg-green-50 opacity-80",
  };

  const isEditing = editingId === task.id;
  const [aiDecision, setAiDecision] = useState<{
    nextState: "PENDING" | "EXECUTING" | "DONE";
    reason: string;
  } | null>(null);

  const [agentRun, setAgentRun] = useState<AgentRun | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);

  const handleStartAgent = async () => {
    const runId = await startAgentRun(task.id);

    const run = await fetchAgentRun(runId);
    const steps = await fetchAgentSteps(runId);

    setAgentRun(run);
    setAgentSteps(steps);
  };

  // const handleStartAgent = async () => {
  //   setLoading(true);
  //   try {
  //     const runId = await startAgentRun(task.id);
  //     setAgentRunId(runId);
  //   } catch (e: any) {
  //     const message =
  //       e.response?.data?.message ?? "AIエージェントの起動に失敗しました";

  //     alert(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const [loadingAi, setLoadingAi] = useState(false);

  const onAskAi = async (e: React.MouseEvent) => {
    e.stopPropagation(); // ← 行クリックを止める（重要）
    setLoadingAi(true);
    try {
      const res = await getTaskAiDecision(task.id);
      setAiDecision(res);
    } catch (err) {
      console.error(err);
      alert("AI判断の取得に失敗しました");
    } finally {
      setLoadingAi(false);
    }
  };

  const onApplyAi = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!aiDecision) return;

    try {
      await updateTaskState(task.id, aiDecision.nextState);

      if (aiDecision.nextState === task.state) {
        toast.success("AI判断を反映しました（状態変更なし）");
      } else {
        toast.success(
          `AI判断を反映しました：${stateLabelMap[aiDecision.nextState]}`
        );
      }

      onRefreshTasks();
      setAiDecision(null);
    } catch (err) {
      console.error(err);
      toast.error("AI判断の反映に失敗しました");
    }
  };

  const stateLabelMap: Record<string, string> = {
    PENDING: "未着手",
    EXECUTING: "進行中",
    DONE: "完了",
  };

  const stateColorMap: Record<string, string> = {
    PENDING: "bg-gray-200 text-gray-700",
    EXECUTING: "bg-blue-100 text-blue-700",
    DONE: "bg-green-100 text-green-700",
  };

  useEffect(() => {
    if (!agentRun) return;

    if (agentRun.status === "RUNNING") {
      const timer = setInterval(async () => {
        const run = await fetchAgentRun(agentRun.id);
        const steps = await fetchAgentSteps(agentRun.id);

        setAgentRun(run);
        setAgentSteps(steps);

        if (run.status === "COMPLETED" || run.status === "FAILED") {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [agentRun?.id, agentRun?.status]);

  return (
    <li
      className={`
        flex flex-col sm:flex-row sm:items-center justify-between
        p-4 rounded-xl border
        transition-all duration-200
         ${stateRowStyle[task.state]}
${
  task.state === "DONE"
    ? "bg-gray-100/80 text-gray-400 line-through scale-[0.98]"
    : "bg-white hover:shadow-lg hover:-translate-y-0.5"
}

      `}
    >
      {isEditing ? (
        // ------------------
        // 編集モード
        // ------------------
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full animate-fadeIn">
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              onChangeEditData({ ...editData, title: e.target.value })
            }
            className="border rounded-lg p-2 flex-1 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={editData.dueDate}
            onChange={(e) =>
              onChangeEditData({ ...editData, dueDate: e.target.value })
            }
            className="border rounded-lg p-2"
          />

          <select
            value={editData.priority}
            onChange={(e) =>
              onChangeEditData({
                ...editData,
                priority: e.target.value as Priority,
              })
            }
            className="border rounded-lg p-2"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>

          <button
            onClick={() => onSaveEdit(task)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg shadow"
          >
            保存
          </button>
          <button
            onClick={onCancelEdit}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded-lg"
          >
            キャンセル
          </button>
        </div>
      ) : (
        // ------------------
        // 通常モード
        // ------------------
        <>
          <div
            className="flex items-center justify-between w-full cursor-pointer"
            onClick={() => onClickTask(task)}
          >
            <div className="flex items-center gap-3">
              {/* チェックボックスにアニメーション */}
              {/* <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task)}
                className="w-5 h-5 accent-blue-500 transition-transform duration-150 hover:scale-110"
              /> */}

              <div className="flex flex-col">
                {/* ★ 状態バッジ */}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full w-fit mb-1 ${
                    stateColorMap[task.state]
                  }`}
                >
                  {stateLabelMap[task.state]}
                </span>

                {task.state === "EXECUTING" && (
                  <div className="text-xs text-gray-400 mb-1">AI判断済み</div>
                )}

                <p className="text-lg font-medium">{task.title}</p>

                {task.dueDate && (
                  <p className={`text-sm ${getDueDateColor(task.dueDate)}`}>
                    締切: {task.dueDate}
                  </p>
                )}

                {task.priority && (
                  <p className={`text-sm ${priorityColor[task.priority]}`}>
                    優先度: {task.priority.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            {/* 削除アイコン（ホバーで赤く） */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // ← 行全体クリックの邪魔をしない
                onDelete(task.id);
              }}
              className="
                p-2 rounded-full transition-all
                hover:bg-red-100 hover:text-red-600
                active:scale-90
              "
            >
              <Trash2 size={18} />
            </button>
          </div>

          <button onClick={handleStartAgent}>🤖 AIに計画を立てさせる</button>

          {!task.dueDate && (
            <p className="text-xs text-gray-400 mt-1">
              ※ AIが締切日を必要と判断した場合、入力を求められます
            </p>
          )}

          {agentRun && (
            <AgentRunPanel
              agentRun={agentRun}
              steps={agentSteps}
              onResume={async () => {
                await resumeAgentRun(agentRun.id);

                const refresh = async () => {
                  const run = await fetchAgentRun(agentRun.id);
                  const steps = await fetchAgentSteps(agentRun.id);
                  setAgentRun(run);
                  setAgentSteps(steps);
                };

                // 即1回
                await refresh();

                // 少し待ってもう一度（Agent が裏で進む時間）
                setTimeout(refresh, 500);
                setTimeout(refresh, 1500);
              }}
              onApproved={async () => {
                setAgentRun(null);
                onRefreshTasks();
              }}
            />
          )}

          {/* 🤖 AI判断 */}
          {task.state !== "DONE" && (
            <div className="mt-3">
              <button
                onClick={onAskAi}
                disabled={loadingAi}
                className="
        px-4 py-2
        rounded-lg
        border border-blue-300
        text-blue-600 text-sm font-medium
        bg-white
        hover:bg-blue-50
        transition-colors
        disabled:opacity-50
      "
              >
                AI判定
              </button>

              {aiDecision && (
                <div className="mt-2 rounded-lg border p-2 bg-slate-50">
                  <div className="font-semibold text-sm">
                    AI提案：{aiDecision.nextState}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {aiDecision.reason}
                  </div>

                  <button
                    onClick={onApplyAi}
                    className="text-xs px-2 py-1 border rounded hover:bg-blue-50"
                  >
                    この提案を反映
                  </button>
                </div>
              )}

              <AiDecisionLogList taskId={task.id} />
            </div>
          )}

          <SubtaskList taskId={task.id} />
        </>
      )}
    </li>
  );
}

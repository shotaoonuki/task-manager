import React from "react";
import type { TaskItem, Priority } from "../types/task";
import { useState } from "react";
import { getTaskAiDecision, updateTaskState } from "../api/taskApi";
import type { TaskState } from "../types/task";

type Props = {
  task: TaskItem;
  onClose: () => void;
  onToggleComplete: (task: TaskItem) => void;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: number) => void;
  priorityColor: Record<Priority, string>;
  getDueDateColor: (dueDate: string | null) => string;
};

export default function TaskModal({
  task,
  onClose,
  onToggleComplete,
  onEdit,
  onDelete,
  priorityColor,
  getDueDateColor,
}: Props) {
  const [aiDecision, setAiDecision] = useState<{
    nextState: TaskState;
    reason: string;
  } | null>(null);

  const [loadingAi, setLoadingAi] = useState(false);

  const onAskAi = async () => {
    setLoadingAi(true);
    try {
      const res = await getTaskAiDecision(task.id);
      setAiDecision(res);
    } catch (e) {
      alert("AI判断に失敗しました");
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const onApplyAi = async () => {
    if (!aiDecision) return;

    try {
      await updateTaskState(task.id, aiDecision.nextState);
      alert("AI提案を反映しました");
      onClose();
    } catch {
      alert("状態更新に失敗しました");
    }
  };

  return (
    // ① 背景オーバーレイ（クリックで閉じる）
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* ② モーダル本体 */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-2">{task.title}</h2>

        {/* 🤖 AI判断 */}
        {task.state !== "DONE" && (
          <button
            onClick={onAskAi}
            disabled={loadingAi}
            className="
      mb-4
      flex items-center gap-2
      px-4 py-2
      rounded-lg
      border border-blue-300
      text-blue-600
      hover:bg-blue-50
      transition
      disabled:opacity-50
    "
          >
            AI判定
          </button>
        )}

        {aiDecision && (
          <div className="mb-4 p-3 rounded-lg bg-slate-50 border">
            <div className="font-semibold text-sm">
              AIの提案：{aiDecision.nextState}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {aiDecision.reason}
            </div>

            <button
              onClick={onApplyAi}
              className="mt-2 text-xs px-3 py-1 border rounded hover:bg-blue-50"
            >
              この提案を反映
            </button>
          </div>
        )}

        <p className="text-gray-600 mb-2">
          締切：{" "}
          <span className={getDueDateColor(task.dueDate)}>
            {task.dueDate || "未設定"}
          </span>
        </p>

        <p className={`mb-4 ${priorityColor[task.priority]}`}>
          優先度：{task.priority?.toUpperCase() || "未設定"}
        </p>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              onToggleComplete(task);
              onClose();
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            {task.completed ? "未完了に戻す" : "完了にする"}
          </button>

          <button
            onClick={() => {
              onEdit(task);
              onClose();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            編集
          </button>

          <button
            onClick={() => {
              onDelete(task.id);
              onClose();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            削除
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

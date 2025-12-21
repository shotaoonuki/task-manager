import React, { useState, useEffect, useRef } from "react";
import { getSubtasks, updateSubtask, deleteSubtask } from "../api/subtaskApi";
import type { Subtask } from "../types/task";
import { X } from "lucide-react";

type Props = {
  taskId: number;
};

export default function SubtaskList({ taskId }: Props) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // 前のリクエストをキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいAbortControllerを作成
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const loadSubtasks = async () => {
      try {
        setLoading(true);
        const data = await getSubtasks(taskId, abortController.signal);
        // リクエストがキャンセルされていない場合のみ状態を更新
        if (!abortController.signal.aborted) {
          setSubtasks(data);
        }
      } catch (error: unknown) {
        // AbortError/ERR_CANCELEDは無視（リクエストがキャンセルされた場合）
        const isCanceled =
          error instanceof DOMException && error.name === "AbortError";

        if (!isCanceled) {
          console.error("Failed to load subtasks:", error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSubtasks();

    // クリーンアップ関数
    return () => {
      abortController.abort();
    };
  }, [taskId]);

  const handleToggleComplete = async (subtask: Subtask) => {
    try {
      const updated = await updateSubtask(taskId, subtask.id, {
        ...subtask,
        completed: !subtask.completed,
      });
      setSubtasks((prev) =>
        prev.map((st) => (st.id === updated.id ? updated : st))
      );
    } catch (error) {
      console.error("Failed to update subtask:", error);
    }
  };

  const handleDelete = async (subtaskId: number) => {
    try {
      await deleteSubtask(taskId, subtaskId);
      setSubtasks((prev) => prev.filter((st) => st.id !== subtaskId));
    } catch (error) {
      console.error("Failed to delete subtask:", error);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">読み込み中...</div>;
  }

  if (subtasks.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pl-6 border-l-2 border-blue-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">サブタスク</h3>
      <ul className="space-y-2">
        {subtasks.map((subtask) => (
          <li
            key={subtask.id}
            className={`
              flex items-center gap-2 p-2 rounded-lg
              ${subtask.completed ? "bg-gray-100" : "bg-blue-50"}
            `}
          >
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={() => handleToggleComplete(subtask)}
              className="w-4 h-4 accent-blue-500"
            />
            <span
              className={`flex-1 text-sm ${
                subtask.completed
                  ? "text-gray-500 line-through"
                  : "text-gray-800"
              }`}
            >
              {subtask.title}
            </span>
            <button
              onClick={() => handleDelete(subtask.id)}
              className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
              title="削除"
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

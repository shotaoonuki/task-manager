import React from "react";
import type { Task, Priority } from "../types/task";

type Props = {
  task: Task;
  onClose: () => void;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
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
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transform transition-all duration-300 scale-95 animate-slideUp"
        onClick={(e) => e.stopPropagation()} // ← クリックが親に伝播しないように！
      >
        <h2 className="text-2xl font-bold mb-2">{task.title}</h2>

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

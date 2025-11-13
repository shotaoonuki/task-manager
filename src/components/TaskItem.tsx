import React from "react";
import type { Task, Priority, EditData } from "../types/task";
import { Trash2 } from "lucide-react"; // ← アイコン追加（自動で入る）

type Props = {
  task: Task;
  editingId: number | null;
  editData: EditData;
  onChangeEditData: (data: EditData) => void;
  onSaveEdit: (task: Task) => void;
  onCancelEdit: () => void;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number) => void;
  onClickTask: (task: Task) => void;
  priorityColor: Record<Priority, string>;
  getDueDateColor: (dueDate: string | null) => string;
};

export default function TaskItem({
  task,
  editingId,
  editData,
  onChangeEditData,
  onSaveEdit,
  onCancelEdit,
  onToggleComplete,
  onDelete,
  onClickTask,
  priorityColor,
  getDueDateColor,
}: Props) {
  const isEditing = editingId === task.id;

  return (
    <li
      className={`
        flex flex-col sm:flex-row sm:items-center justify-between
        p-4 rounded-xl border
        transition-all duration-200
        ${
          task.completed
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
        <div
          className="flex items-center justify-between w-full cursor-pointer"
          onClick={() => onClickTask(task)}
        >
          <div className="flex items-center gap-3">
            {/* チェックボックスにアニメーション */}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task)}
              className="w-5 h-5 accent-blue-500 transition-transform duration-150 hover:scale-110"
            />

            <div className="flex flex-col">
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
      )}
    </li>
  );
}

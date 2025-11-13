import React from "react";
import type { Priority } from "../types/task";

type Props = {
  newTitle: string;
  newDueDate: string;
  newPriority: Priority;
  onChangeTitle: (value: string) => void;
  onChangeDueDate: (value: string) => void;
  onChangePriority: (value: Priority) => void;
  onAdd: () => void;
};

export default function TaskForm({
  newTitle,
  newDueDate,
  newPriority,
  onChangeTitle,
  onChangeDueDate,
  onChangePriority,
  onAdd,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      <input
        type="text"
        value={newTitle}
        onChange={(e) => onChangeTitle(e.target.value)}
        placeholder="新しいタスクを入力"
        className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="date"
        value={newDueDate}
        onChange={(e) => onChangeDueDate(e.target.value)}
        className="border rounded-lg p-2"
      />
      <select
        value={newPriority}
        onChange={(e) => onChangePriority(e.target.value as Priority)}
        className="border rounded-lg p-2"
      >
        <option value="low">低</option>
        <option value="medium">中</option>
        <option value="high">高</option>
      </select>
      <button
        onClick={onAdd}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white px-4 py-2 rounded-lg shadow"
      >
        追加
      </button>
    </div>
  );
}

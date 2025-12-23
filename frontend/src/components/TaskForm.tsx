import React, { useState } from "react";
import type { Priority } from "../types/task";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  newTitle: string;
  newDueDate: string;
  newPriority: Priority;
  onChangeTitle: (value: string) => void;
  onChangeDueDate: (value: string) => void;
  onChangePriority: (value: Priority) => void;
  onAdd: () => void;
  onGenerateSubtasks?: (taskTitle: string) => Promise<void>;
};

export default function TaskForm({
  newTitle,
  newDueDate,
  newPriority,
  onChangeTitle,
  onChangeDueDate,
  onChangePriority,
  onAdd,
  onGenerateSubtasks,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSubtasks = async () => {
    if (!newTitle.trim()) {
      toast.error("タスク名を入力してください");
      return;
    }

    if (!onGenerateSubtasks) {
      toast.error("サブタスク生成機能は利用できません");
      return;
    }

    try {
      setIsGenerating(true);
      await onGenerateSubtasks(newTitle);
      // 成功メッセージはuseTasks内で表示されるため、ここでは表示しない
    } catch (error: unknown) {
      console.error("Failed to generate subtasks in TaskForm:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-2 justify-center">
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
      {onGenerateSubtasks && (
        <div className="flex justify-center">
          <button
            onClick={handleGenerateSubtasks}
            disabled={isGenerating || !newTitle.trim()}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg shadow
              transition-all duration-200
              ${
                isGenerating || !newTitle.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-white"
              }
            `}
          >
            <Sparkles size={16} />
            {isGenerating ? "生成中..." : "AIでサブタスクを生成"}
          </button>
        </div>
      )}
    </div>
  );
}

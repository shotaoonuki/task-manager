import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import TaskModal from "./TaskModal";
import type { Priority } from "../types/task";
import toast from "react-hot-toast";


export default function TaskList() {
  const {
    tasks,
    filteredTasks,
    selectedTask,
    loading,
    error,
    progress,
    completedCount,
    totalCount,
    filter,
    sortOption,
    editingId,
    editData,

    setFilter,
    setSortOption,
    setEditData,

    fetchTasks,
    handleAdd,
    handleDelete,
    handleToggleComplete,
    startEditing,
    saveEdit,
    cancelEdit,

    openModal,
    closeModal,

    handleGenerateSubtasks,
  } = useTasks();

  // フォーム用
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");

  // 追加ボタン
  const addNewTask = () => {
    handleAdd({
      title: newTitle,
      description: "",
      completed: false,
      dueDate: newDueDate || null,
      priority: newPriority,
    });

    setNewTitle("");
    setNewDueDate("");
    setNewPriority("medium");
  };

  // 色定義（UI専用）
  const priorityColor = {
    high: "text-red-500 font-bold",
    medium: "text-yellow-500 font-semibold",
    low: "text-green-500",
  };

  const getDueDateColor = (dueDate: string | null) => {
    if (!dueDate) return "text-gray-400";
    const today = new Date();
    const date = new Date(dueDate);
    const diff = date.getTime() - today.getTime();

    if (diff < -86400000) return "text-red-500 font-semibold";
    if (Math.abs(diff) < 86400000) return "text-orange-500 font-semibold";
    return "text-green-600";
  };

  // クリック（モーダルか編集か）
  let clickTimeout: ReturnType<typeof setTimeout> | null = null;

  const handleClickTask = (task: any) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      startEditing(task); // double click
    } else {
      clickTimeout = setTimeout(() => {
        openModal(task); // single click
        clickTimeout = null;
      }, 250);
    }
  };

  return (
    <div className="pt-36 p-8 max-w-2xl mx-auto bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
        📝 タスク管理アプリ
      </h1>

      {/* 進捗バー */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>進捗: {progress}%</span>
          <span>
            {completedCount} / {totalCount} 件完了
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full">
          <div
            className="h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* 入力フォーム */}
      <TaskForm
        newTitle={newTitle}
        newDueDate={newDueDate}
        newPriority={newPriority}
        onChangeTitle={setNewTitle}
        onChangeDueDate={setNewDueDate}
        onChangePriority={setNewPriority}
        onAdd={addNewTask}
        onGenerateSubtasks={handleGenerateSubtasks}
      />

      {/* フィルター & ソート */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          すべて
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded ${filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          未完了
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          完了
        </button>

        <select
          value={sortOption}
          onChange={(e) =>
            setSortOption(
              e.target.value as "default" | "dueDate" | "priority"
            )
          }
          className="ml-4 border rounded-lg p-1"
        >
          <option value="default">並び替え: 登録順</option>
          <option value="dueDate">締切が近い順</option>
          <option value="priority">優先度が高い順</option>
        </select>
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={async () => {
            await fetchTasks();
            toast.success("🔄 サーバーと同期しました");
          }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
        >
          🔄 サーバーと同期
        </button>

      </div>

      {loading && <p className="text-gray-500 text-center">📡 読み込み中...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* タスク一覧 */}
      <ul className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            editingId={editingId}
            editData={editData}
            onChangeEditData={setEditData}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            onClickTask={handleClickTask}
            priorityColor={priorityColor}
            getDueDateColor={getDueDateColor}
          />
        ))}
      </ul>

      {/* モーダル */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={closeModal}
          onToggleComplete={handleToggleComplete}
          onEdit={startEditing}
          onDelete={handleDelete}
          priorityColor={priorityColor}
          getDueDateColor={getDueDateColor}
        />
      )}
    </div>
  );
}

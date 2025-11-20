import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import type { Task, EditData } from "../types/task";
import toast from "react-hot-toast";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] =
    useState<"all" | "active" | "completed">("all");
  const [sortOption, setSortOption] =
    useState<"default" | "dueDate" | "priority">("default");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<EditData>({
    title: "",
    dueDate: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // ==============================
  // 初回読み込み
  // ==============================
  useEffect(() => {
    fetchTasks();
  }, [token]);

  // ==============================
  // API 呼び分け（★★★修正ポイント★★★）
  // ==============================
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = token ? "/api/tasks" : "/api/tasks/public";
      const res = await api.get(url);
      setTasks(res.data);
    } catch (err) {
      setError("タスク取得に失敗しました");
      toast.error("タスク取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (task: Partial<Task>) => {
    try {
      const url = token ? "/api/tasks" : "/api/tasks/public";
      const res = await api.post(url, task);

      setTasks([...tasks, res.data]);
      toast.success("タスクを追加しました");
    } catch {
      toast.error("追加に失敗しました");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const url = token
        ? `/api/tasks/${id}`
        : `/api/tasks/public/${id}`;

      await api.delete(url);

      setTasks(tasks.filter((t) => t.id !== id));
      toast.success("削除しました");
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const updated = { ...task, completed: !task.completed };

    try {
      const url = token
        ? `/api/tasks/${task.id}`
        : `/api/tasks/public/${task.id}`;

      await api.put(url, updated);

      fetchTasks();
    } catch {
      toast.error("更新に失敗しました");
    }
  };

  // ==============================
  // 編集機能
  // ==============================
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditData({
      title: task.title,
      dueDate: task.dueDate ?? "",
      priority: task.priority,
    });
  };

  const saveEdit = async (task: Task) => {
    try {
      const url = token
        ? `/api/tasks/${task.id}`
        : `/api/tasks/public/${task.id}`;

      await api.put(url, { ...task, ...editData });

      setEditingId(null);
      fetchTasks();

      toast.success("タスクを更新しました");
    } catch {
      toast.error("更新に失敗しました");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // ==============================
  // モーダル
  // ==============================
  const openModal = (task: Task) => setSelectedTask(task);
  const closeModal = () => setSelectedTask(null);

  // ==============================
  // ソート & フィルタ
  // ==============================
  const sortTasks = (list: Task[]) => {
    if (sortOption === "dueDate") {
      return [...list].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    if (sortOption === "priority") {
      const order = { high: 1, medium: 2, low: 3 };
      return [...list].sort((a, b) => order[a.priority] - order[b.priority]);
    }

    return list;
  };

  const filteredTasks = sortTasks(
    tasks.filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "active") return !task.completed;
      return true;
    })
  );

  // ==============================
  // 進捗率
  // ==============================
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progress =
    totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0;

  // ==============================
  // return
  // ==============================
  return {
    tasks,
    filteredTasks,
    selectedTask,
    editingId,
    editData,

    loading,
    error,

    filter,
    sortOption,

    progress,
    completedCount,
    totalCount,

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
  };
}

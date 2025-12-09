import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import type { Task, EditData } from "../types/task";
import { generateSubtasks } from "../api/subtaskApi";
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
      // レスポンスが配列であることを確認
      const tasksData = Array.isArray(res.data) ? res.data : [];
      setTasks(tasksData);
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      const errorMessage = err.response?.status === 404
        ? "バックエンドサーバーが起動していないか、エンドポイントが見つかりません"
        : err.response?.data?.message || "タスク取得に失敗しました";
      setError(errorMessage);
      toast.error(errorMessage);
      // エラー時も空配列を設定
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (task: Partial<Task>) => {
    try {
      const url = token ? "/api/tasks" : "/api/tasks/public";
      const res = await api.post(url, task);

      setTasks(Array.isArray(tasks) ? [...tasks, res.data] : [res.data]);
      toast.success("タスクを追加しました");
      return res.data;
    } catch {
      toast.error("追加に失敗しました");
      return null;
    }
  };

  const handleGenerateSubtasks = async (taskTitle: string) => {
    if (!taskTitle.trim()) {
      toast.error("タスク名を入力してください");
      return;
    }

    try {
      // 一時的なタスクを作成（サブタスク生成用）
      const tempTask = {
        title: taskTitle,
        description: "",
        completed: false,
        dueDate: null,
        priority: "medium" as const,
      };

      // ログイン状態に応じてエンドポイントを選択
      const url = token ? "/api/tasks" : "/api/tasks/public";
      
      console.log("Creating task at:", url, tempTask);
      
      let createdTask;
      try {
        const res = await api.post(url, tempTask);
        createdTask = res.data;
        console.log("Task created:", createdTask);
      } catch (taskError: any) {
        console.error("Failed to create task:", taskError);
        console.error("Error details:", {
          status: taskError.response?.status,
          statusText: taskError.response?.statusText,
          data: taskError.response?.data,
          message: taskError.message,
        });
        
        let errorMessage = "タスクの作成に失敗しました";
        if (taskError.response?.status === 404) {
          errorMessage = "バックエンドサーバーが起動していないか、エンドポイントが見つかりません。バックエンドサーバーを起動してください。";
        } else if (taskError.response?.status === 401) {
          errorMessage = "認証が必要です。ログインしてください。";
        } else if (taskError.response?.data?.message) {
          errorMessage = taskError.response.data.message;
        } else if (taskError.message) {
          errorMessage = taskError.message;
        }
        
        toast.error(errorMessage);
        return;
      }

      if (!createdTask || !createdTask.id) {
        toast.error("タスクの作成に失敗しました（IDが取得できませんでした）");
        return;
      }

      // サブタスクを生成（ログイン不要）
      console.log("Generating subtasks for task:", createdTask.id);
      try {
        await generateSubtasks(createdTask.id, {
          taskTitle: taskTitle,
        });
        console.log("Subtasks generated successfully");
      } catch (subtaskError: any) {
        console.error("Failed to generate subtasks:", subtaskError);
        console.error("Subtask error details:", {
          status: subtaskError.response?.status,
          statusText: subtaskError.response?.statusText,
          data: subtaskError.response?.data,
          message: subtaskError.message,
        });
        
        let errorMessage = "サブタスクの生成に失敗しました";
        if (subtaskError.response?.status === 404) {
          errorMessage = "サブタスク生成エンドポイントが見つかりません";
        } else if (subtaskError.response?.data?.message) {
          errorMessage = subtaskError.response.data.message;
        } else if (subtaskError.message) {
          errorMessage = subtaskError.message;
        }
        
        toast.error(errorMessage);
        return;
      }

      // タスクリストを更新
      await fetchTasks();
      
      toast.success("サブタスクを生成しました！");
    } catch (error: any) {
      console.error("Unexpected error in handleGenerateSubtasks:", error);
      toast.error(
        error.response?.data?.message || error.message || "サブタスクの生成に失敗しました"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const url = token
        ? `/api/tasks/${id}`
        : `/api/tasks/public/${id}`;

      await api.delete(url);

      setTasks(Array.isArray(tasks) ? tasks.filter((t) => t.id !== id) : []);
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

  const filteredTasks = (() => {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return [];
    }
    const filtered = tasks.filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "active") return !task.completed;
      return true;
    });
    return sortTasks(filtered);
  })();

  // ==============================
  // 進捗率
  // ==============================
  const completedCount = Array.isArray(tasks) 
    ? tasks.filter((t) => t.completed).length 
    : 0;
  const totalCount = Array.isArray(tasks) ? tasks.length : 0;
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

    handleGenerateSubtasks,
  };
}

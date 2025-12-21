import { useEffect, useState, useMemo } from "react";
import api from "../api/axiosInstance";
import type { TaskItem, TaskState, EditData, Priority } from "../types/task";
import { generateSubtasks } from "../api/subtaskApi";
import toast from "react-hot-toast";
import { updateTaskState } from "../api/taskApi";
import axios from "axios";
import { useCallback } from "react";

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortOption, setSortOption] = useState<
    "default" | "dueDate" | "priority"
  >("default");

  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

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
  // API 呼び分け（★★★修正ポイント★★★）
  // ==============================
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = token ? "/api/tasks" : "/api/tasks/public";
      const res = await api.get(url);
      // レスポンスが配列であることを確認
      const tasksData = Array.isArray(res.data) ? res.data : [];
      setTasks(tasksData);
    } catch (err: unknown) {
      console.error("Failed to fetch tasks:", err);
      let errorMessage = "タスク取得に失敗しました";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          errorMessage =
            "バックエンドサーバーが起動していないか、エンドポイントが見つかりません";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      setError(errorMessage);
      toast.error(errorMessage);
      // エラー時も空配列を設定
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ==============================
  // 初回読み込み
  // ==============================
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAdd = async (task: Partial<TaskItem>) => {
    try {
      const url = token ? "/api/tasks" : "/api/tasks/public";
      const res = await api.post(url, task);

      setTasks(Array.isArray(tasks) ? [...tasks, res.data] : [res.data]);
      toast.success("タスクを追加しました");
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
      } catch (taskError: unknown) {
        console.error("Failed to create task:", taskError);

        let message = "タスクの作成に失敗しました";
        if (axios.isAxiosError(taskError)) {
          if (taskError.response?.status === 404) {
            message =
              "バックエンドサーバーが起動していないか、エンドポイントが見つかりません";
          } else if (taskError.response?.status === 401) {
            message = "認証が必要です。ログインしてください。";
          } else if (taskError.response?.data?.message) {
            message = taskError.response.data.message;
          }
        }

        toast.error(message);
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
      } catch (subtaskError: unknown) {
        console.error("Failed to generate subtasks:", subtaskError);

        let message = "サブタスクの生成に失敗しました";
        if (axios.isAxiosError(subtaskError)) {
          if (subtaskError.response?.status === 404) {
            message = "サブタスク生成エンドポイントが見つかりません";
          } else if (subtaskError.response?.data?.message) {
            message = subtaskError.response.data.message;
          }
        }

        toast.error(message);
        return;
      }

      // タスクリストを更新
      await fetchTasks();

      toast.success("サブタスクを生成しました！");
    } catch (error: unknown) {
      console.error("Unexpected error in handleGenerateSubtasks:", error);
      toast.error("予期しないエラーが発生しました");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const url = token ? `/api/tasks/${id}` : `/api/tasks/public/${id}`;

      await api.delete(url);

      setTasks(Array.isArray(tasks) ? tasks.filter((t) => t.id !== id) : []);
      toast.success("削除しました");
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  const handleToggleComplete = async (task: TaskItem) => {
    try {
      await updateTaskState(task.id, "DONE");
      toast.success("タスクを完了にしました");
      fetchTasks();
    } catch {
      toast.error("完了に失敗しました");
    }
  };

  // ==============================
  // 編集機能
  // ==============================
  const startEditing = (task: TaskItem) => {
    setEditingId(task.id);
    setEditData({
      title: task.title,
      dueDate: task.dueDate ?? "",
      priority: task.priority,
    });
  };

  const saveEdit = async (task: TaskItem) => {
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
  const openModal = (task: TaskItem) => setSelectedTask(task);
  const closeModal = () => setSelectedTask(null);

  // ==============================
  // ソート & フィルタ
  // ==============================
  const stateOrder = useMemo<Record<TaskState, number>>(
    () => ({
      EXECUTING: 0,
      PENDING: 1,
      DONE: 2,
    }),
    []
  );

  const priorityOrder = useMemo<Record<Priority, number>>(
    () => ({
      high: 0,
      medium: 1,
      low: 2,
    }),
    []
  );

  const sortTasks = useCallback(
    (list: TaskItem[]) => {
      return [...list].sort((a, b) => {
        const stateDiff = stateOrder[a.state] - stateOrder[b.state];
        if (stateDiff !== 0) return stateDiff;

        if (sortOption === "dueDate") {
          if (a.dueDate && b.dueDate) {
            const diff =
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            if (diff !== 0) return diff;
          }
          if (a.dueDate && !b.dueDate) return -1;
          if (!a.dueDate && b.dueDate) return 1;
        }

        if (sortOption === "priority") {
          const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (diff !== 0) return diff;
        }

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    },
    [sortOption, stateOrder, priorityOrder]
  );

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return [];
    }

    const filtered = tasks.filter((task) => {
      if (filter === "completed") return task.state === "DONE";
      if (filter === "active") return task.state !== "DONE";
      return true;
    });

    return sortTasks(filtered);
  }, [tasks, filter, sortTasks]);

  // ==============================
  // 進捗率
  // ==============================
  const completedCount = Array.isArray(tasks)
    ? tasks.filter((t) => t.state === "DONE").length
    : 0;
  const totalCount = Array.isArray(tasks) ? tasks.length : 0;
  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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

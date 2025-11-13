import { useEffect, useState } from "react";
import {
    getTasks,
    addTask,
    deleteTask,
    updateTask,
} from "../api/taskApi";
import type { Task, Priority, EditData } from "../types/task";
import toast from "react-hot-toast";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] =
        useState<"all" | "active" | "completed">("all");
    const [sortOption, setSortOption] = useState<
        "default" | "dueDate" | "priority"
    >("default");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 編集中管理
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<EditData>({
        title: "",
        dueDate: "",
        priority: "medium",
    });

    // モーダル管理
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // 初回読み込み
    useEffect(() => {
        const saved = localStorage.getItem("tasks");
        if (saved) setTasks(JSON.parse(saved));

        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);
            localStorage.setItem("tasks", JSON.stringify(data));

            toast.success("🔄 サーバーと同期しました");
        } catch (err) {
            console.error(err);
            toast.error("❌ 通信エラーが発生しました");
        }
    };

    const handleAdd = async (task: Partial<Task>) => {
        if (!task.title?.trim()) {
            toast("⚠️ タイトルを入力してください");
            return;
        }

        await addTask(task);
        await fetchTasks();

        toast.success("✨ タスクを追加しました");
    };

    const handleDelete = async (id: number) => {
        await deleteTask(id);
        await fetchTasks();

        toast.success("🗑️ タスクを削除しました");
    };

    const handleToggleComplete = async (task: Task) => {
        const updated = { ...task, completed: !task.completed };

        await updateTask(task.id, updated);
        await fetchTasks();

        toast.success(
            updated.completed ? "✅ 完了にしました" : "↩️ 未完了に戻しました"
        );
    };

    const startEditing = (task: Task) => {
        setEditingId(task.id);
        setEditData({
            title: task.title,
            dueDate: task.dueDate ?? "",
            priority: task.priority,
        });
    };

    const saveEdit = async (task: Task) => {
        await updateTask(task.id, { ...task, ...editData });
        setEditingId(null);
        await fetchTasks();

        toast.success("✏️ タスクを更新しました");
    };

    const cancelEdit = () => setEditingId(null);

    // モーダル
    const openModal = (task: Task) => setSelectedTask(task);
    const closeModal = () => setSelectedTask(null);

    // ソート処理
    const sortTasks = (list: Task[]) => {
        if (sortOption === "dueDate") {
            return [...list].sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return (
                    new Date(a.dueDate!).getTime() -
                    new Date(b.dueDate!).getTime()
                );
            });
        }

        if (sortOption === "priority") {
            const order = { high: 1, medium: 2, low: 3 };
            return [...list].sort(
                (a, b) => order[a.priority] - order[b.priority]
            );
        }

        return list;
    };

    // filter → sort → completed の順で整形
    const filteredTasks = sortTasks(
        [...tasks]
            .filter((task) => {
                if (filter === "completed") return task.completed;
                if (filter === "active") return !task.completed;
                return true;
            })
            .sort((a, b) => Number(a.completed) - Number(b.completed))
    );

    // 進捗計算
    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;
    const progress =
        totalCount > 0
            ? Math.round((completedCount / totalCount) * 100)
            : 0;

    return {
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
    };
}

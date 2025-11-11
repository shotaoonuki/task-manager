import React, { useEffect, useState } from "react";
import { getTasks, addTask, deleteTask, updateTask } from "../api/taskApi";

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [newPriority, setNewPriority] = useState("medium");
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ title: "", dueDate: "", priority: "" });
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // ✅ localStorage から読み込み（即座に反映）
        const saved = localStorage.getItem("tasks");
        if (saved) {
            setTasks(JSON.parse(saved));
        }

        // ✅ サーバーからも取得（同期）
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTasks();
            setTasks(data);
            localStorage.setItem("tasks", JSON.stringify(data));
        } catch (err) {
            console.error(err);
            setError("サーバーとの通信に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newTitle.trim()) return;
        const newTask = {
            title: newTitle,
            description: "",
            completed: false,
            dueDate: newDueDate || null,
            priority: newPriority,
        };
        await addTask(newTask);
        const updated = await getTasks();
        setTasks(updated);
        localStorage.setItem("tasks", JSON.stringify(updated)); // ←追加
        setNewTitle("");
        setNewDueDate("");
        setNewPriority("medium");
    };

    const handleDelete = async (id) => {
        await deleteTask(id);
        const updated = await getTasks();
        setTasks(updated);
        localStorage.setItem("tasks", JSON.stringify(updated)); // ←追加！
    };

    const handleToggleComplete = async (task) => {
        const updatedTask = { ...task, completed: !task.completed };
        await updateTask(task.id, updatedTask);
        const updated = await getTasks();
        setTasks(updated);
        localStorage.setItem("tasks", JSON.stringify(updated)); // ←追加！
    };

    const startEditing = (task) => {
        setEditingId(task.id);
        setEditData({
            title: task.title,
            dueDate: task.dueDate || "",
            priority: task.priority || "medium",
        });
    };

    const saveEdit = async (task) => {
        await updateTask(task.id, { ...task, ...editData });
        setEditingId(null);
        const updated = await getTasks();
        setTasks(updated);
        localStorage.setItem("tasks", JSON.stringify(updated)); // ←追加！
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const priorityColor = {
        high: "text-red-500 font-bold",
        medium: "text-yellow-500 font-semibold",
        low: "text-green-500",
    };

    const getDueDateColor = (dueDate) => {
        if (!dueDate) return "text-gray-400";
        const today = new Date();
        const date = new Date(dueDate);
        const diff = date - today;
        if (diff < -86400000) return "text-red-500 font-semibold";
        if (Math.abs(diff) < 86400000) return "text-orange-500 font-semibold";
        return "text-green-600";
    };

    // 🔹 追加 state（先に宣言）
    const [sortOption, setSortOption] = useState("default");

    // 🔹 ソート処理（優先度未設定に強い・安定ソート）
    const sortTasks = (list) => {
        if (sortOption === "dueDate") {
            return [...list].sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        }
        if (sortOption === "priority") {
            const order = { high: 1, medium: 2, low: 3 };
            const oa = (t) => order[t?.priority] ?? 999;
            return [...list].sort((a, b) => oa(a) - oa(b));
        }
        // default: 登録順を維持（何もしない）
        return list;
    };

    // ✅ フィルター → 完了状態で軽く整列 → 最後にソート適用
    const filteredTasks = sortTasks(
        [...tasks]
            .filter((task) => {
                if (filter === "completed") return task.completed;
                if (filter === "active") return !task.completed;
                return true;
            })
            .sort((a, b) => Number(a.completed) - Number(b.completed)) // 未完→完了
    );


    // ✅ 進捗率計算
    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const [selectedTask, setSelectedTask] = useState(null);

    const openModal = (task) => setSelectedTask(task);
    const closeModal = () => setSelectedTask(null);

    // 👇 シングルクリック vs ダブルクリックを制御
    let clickTimeout = null;

    const handleClick = (task) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            clickTimeout = null;
            startEditing(task); // ダブルクリック扱い
        } else {
            clickTimeout = setTimeout(() => {
                openModal(task); // シングルクリック扱い
                clickTimeout = null;
            }, 250); // 250ms以内に2回クリックでダブルクリックと判定
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white shadow-xl rounded-xl">
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

            {/* 入力欄 */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="新しいタスクを入力"
                    className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="border rounded-lg p-2"
                />
                <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="border rounded-lg p-2"
                >
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                </select>
                <button
                    onClick={handleAdd}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white px-4 py-2 rounded-lg shadow"
                >
                    追加
                </button>
            </div>

            {/* フィルター */}
            <div className="flex justify-center gap-2 mb-4">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    すべて
                </button>
                <button
                    onClick={() => setFilter("active")}
                    className={`px-3 py-1 rounded ${filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    未完了
                </button>
                <button
                    onClick={() => setFilter("completed")}
                    className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    完了
                </button>

                {/* 🔽 ソート追加 */}
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="ml-4 border rounded-lg p-1"
                >
                    <option value="default">並び替え: 登録順</option>
                    <option value="dueDate">締切が近い順</option>
                    <option value="priority">優先度が高い順</option>
                </select>
            </div>

            <div className="flex justify-center mb-4">
                <button
                    onClick={fetchTasks}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
                >
                    🔄 サーバーと同期
                </button>
            </div>

            {loading && <p className="text-gray-500 text-center">📡 読み込み中...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* タスクリスト */}
            <ul className="space-y-3">
                {filteredTasks.map((task) => (
                    <li
                        key={task.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg shadow-sm transition-all ${task.completed
                            ? "bg-gray-100 text-gray-400 line-through"
                            : "bg-gradient-to-r from-white to-gray-50 hover:shadow-md"
                            }`}
                    >
                        {editingId === task.id ? (
                            // 編集モード
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                                <input
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) =>
                                        setEditData({ ...editData, title: e.target.value })
                                    }
                                    className="border rounded-lg p-2 flex-1"
                                />
                                <input
                                    type="date"
                                    value={editData.dueDate}
                                    onChange={(e) =>
                                        setEditData({ ...editData, dueDate: e.target.value })
                                    }
                                    className="border rounded-lg p-2"
                                />
                                <select
                                    value={editData.priority}
                                    onChange={(e) =>
                                        setEditData({ ...editData, priority: e.target.value })
                                    }
                                    className="border rounded-lg p-2"
                                >
                                    <option value="low">低</option>
                                    <option value="medium">中</option>
                                    <option value="high">高</option>
                                </select>
                                <button
                                    onClick={() => saveEdit(task)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    保存
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
                                >
                                    キャンセル
                                </button>
                            </div>
                        ) : (
                            // 通常モード
                            <div
                                className="flex items-center justify-between w-full cursor-pointer"
                                onClick={() => handleClick(task)}
                            >


                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggleComplete(task)}
                                        className="accent-blue-500"
                                    />
                                    <div>
                                        <p className="text-lg">{task.title}</p>
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
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                                >
                                    削除
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {/* ✅ モーダルをここに追加 */}
            {selectedTask && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 animate-fadeIn"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transform transition-all duration-300 scale-95 animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h2 className="text-2xl font-bold mb-2">{selectedTask.title}</h2>
                        <p className="text-gray-600 mb-2">
                            締切:{" "}
                            <span className={getDueDateColor(selectedTask.dueDate)}>
                                {selectedTask.dueDate || "未設定"}
                            </span>
                        </p>
                        <p className={`mb-4 ${priorityColor[selectedTask.priority]}`}>
                            優先度: {selectedTask.priority?.toUpperCase() || "未設定"}
                        </p>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    handleToggleComplete(selectedTask);
                                    closeModal();
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                            >
                                {selectedTask.completed ? "未完了に戻す" : "完了にする"}
                            </button>
                            <button
                                onClick={() => {
                                    startEditing(selectedTask);
                                    closeModal();
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                            >
                                編集
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(selectedTask.id);
                                    closeModal();
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                                削除
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* 開発者向け：APIレスポンスの可視化 */}
            <pre className="mt-6 text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                {JSON.stringify(tasks, null, 2)}
            </pre>

        </div>


    );
}

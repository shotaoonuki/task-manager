import { useEffect, useState } from "react";
import { AiDecisionLog, getTaskAiLogs } from "../api/taskApi";

type Props = {
    taskId: number;
};

export default function AiDecisionLogList({ taskId }: Props) {
    const [logs, setLogs] = useState<AiDecisionLog[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;

        getTaskAiLogs(taskId)
            .then(setLogs)
            .catch(() => alert("AI判断ログの取得に失敗しました"));
    }, [open, taskId]);

    return (
        <div className="mt-2">
            <button
                onClick={() => setOpen(!open)}
                className="text-xs text-blue-600 underline"
            >
                {open ? "AI判断履歴を隠す" : "AI判断履歴を見る"}
            </button>

            {open && (
                <div className="mt-2 space-y-2">
                    {logs.length === 0 && (
                        <div className="text-xs text-gray-400">
                            AI判断履歴はまだありません
                        </div>
                    )}

                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className="border rounded p-2 text-xs bg-gray-50"
                        >
                            <div className="font-semibold">
                                提案状態：{log.suggestedState}
                            </div>
                            <div className="text-gray-600">{log.reason}</div>
                            <div className="text-gray-400 mt-1">
                                {new Date(log.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

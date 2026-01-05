package com.example.taskapp.entity.agent;

public enum AgentRunStatus {

    // 初期・進行中
    PLANNING, // 計画生成中
    RUNNING, // 実行中（将来用）

    // 人間介入待ち
    WAITING_USER_INPUT, // 締切などの入力待ち
    WAITING_FOR_APPROVAL, // 計画承認待ち

    // 終端状態
    COMPLETED, FAILED, REJECTED;

    public boolean isTerminal() {
        return this == COMPLETED || this == FAILED || this == REJECTED;
    }
}

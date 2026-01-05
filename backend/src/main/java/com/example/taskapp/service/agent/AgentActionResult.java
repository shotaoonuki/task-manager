package com.example.taskapp.service.agent;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class AgentActionResult {

    private final boolean waitingForHuman;
    private final boolean continueLoop;

    /* ---------- factory methods ---------- */

    // 人間待ち（WAITING_*）
    public static AgentActionResult waiting() {
        return new AgentActionResult(true, false);
    }

    // ループ継続（次の判断へ）
    public static AgentActionResult continueLoop() {
        return new AgentActionResult(false, true);
    }

    // 明示的終了（terminal）
    public static AgentActionResult finish() {
        return new AgentActionResult(false, false);
    }
}

package com.example.taskapp.dto.agent;

import java.time.Instant;
import java.util.UUID;
import com.example.taskapp.entity.agent.AgentRun;
import com.example.taskapp.entity.agent.AgentRunStatus;

public record AgentRunResponse(UUID id, AgentRunStatus status, Long taskId, String contextJson,
        Instant createdAt, Instant updatedAt) {
    public static AgentRunResponse from(AgentRun run) {
        return new AgentRunResponse(run.getId(), run.getStatus(),
                run.getTask() != null ? run.getTask().getId() : null, run.getContextJson(), // ★
                                                                                            // これが最重要
                run.getCreatedAt(), run.getUpdatedAt());
    }
}

package com.example.taskapp.dto.agent;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import com.example.taskapp.entity.agent.*;;

public record AgentStepResponse(UUID id, AgentDecisionType decisionType, String reasoning,
        String observation, String message, Instant createdAt) {
    public static AgentStepResponse from(AgentStep step) {
        return new AgentStepResponse(step.getId(), step.getDecisionType(), step.getReasoning(),
                step.getObservation(), step.getMessage(), step.getCreatedAt());
    }
}



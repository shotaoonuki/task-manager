package com.example.taskapp.service.agent;

import com.example.taskapp.entity.agent.AgentDecisionType;
import lombok.AllArgsConstructor;
import lombok.Getter;

public record AgentDecision(AgentDecisionType decisionType, String reasoning, String observation) {
    public boolean requiresUserInput() {
        return decisionType == AgentDecisionType.REQUEST_USER_INPUT;
    }

    public boolean requiresApproval() {
        return decisionType == AgentDecisionType.WAIT_FOR_APPROVAL;
    }
}

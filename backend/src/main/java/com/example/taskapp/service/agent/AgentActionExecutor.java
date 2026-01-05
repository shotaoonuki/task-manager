package com.example.taskapp.service.agent;

import com.example.taskapp.entity.agent.AgentRun;

public interface AgentActionExecutor {
    void execute(AgentRun run, AgentDecision decision);
}


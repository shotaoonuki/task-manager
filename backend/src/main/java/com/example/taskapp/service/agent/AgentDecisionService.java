package com.example.taskapp.service.agent;

import com.example.taskapp.entity.agent.AgentRun;

public interface AgentDecisionService {

    AgentDecision decideNext(AgentRun run);
}

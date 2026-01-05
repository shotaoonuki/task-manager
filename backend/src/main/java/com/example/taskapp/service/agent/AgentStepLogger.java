package com.example.taskapp.service.agent;

import com.example.taskapp.entity.agent.AgentDecisionType;
import com.example.taskapp.entity.agent.AgentRun;
import com.example.taskapp.entity.agent.AgentStep;
import com.example.taskapp.repository.agent.AgentStepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AgentStepLogger {

    private final AgentStepRepository agentStepRepository;

    public void stage(AgentRun run, String stage, String description) {

        int order = (int) agentStepRepository.countByAgentRun(run) + 1;

        AgentStep step = new AgentStep();
        step.setAgentRun(run);
        step.setStepOrder(order);

        // ★ 重要：DecisionType は BUILD_PLAN で固定
        step.setDecisionType(AgentDecisionType.BUILD_PLAN);

        step.setReasoning(description);
        step.setObservation(stage);
        step.setMessage("BUILD_PLAN " + stage);
        step.setModelInfo("system");

        agentStepRepository.save(step);
    }
}

package com.example.taskapp.service.agent;

import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import com.example.taskapp.entity.agent.AgentRun;
import com.example.taskapp.entity.agent.AgentRunStatus;
import com.example.taskapp.entity.agent.AgentStep;
import com.example.taskapp.repository.agent.AgentRunRepository;
import com.example.taskapp.repository.agent.AgentStepRepository;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AgentLoopExecutor {

    private final AgentDecisionService decisionService;
    private final AgentActionExecutor actionExecutor;
    private final AgentRunRepository agentRunRepository;
    private final AgentStepRepository agentStepRepository;

    public void execute(AgentRun run) {

        int iterations = 0;
        int maxIterations = 10;

        while (!run.getStatus().isTerminal() && iterations < maxIterations) {

            // 1. 判断
            AgentDecision decision = decisionService.decideNext(run);

            // 2. 判断ログ（証拠）
            logDecision(run, decision);

            // 3. 実行（状態更新・副作用）
            actionExecutor.execute(run, decision);

            // 4. 人間待ちなら break
            if (run.getStatus() == AgentRunStatus.WAITING_USER_INPUT
                    || run.getStatus() == AgentRunStatus.WAITING_FOR_APPROVAL) {
                break;
            }

            iterations++;
        }

        agentRunRepository.save(run);
    }

    public void executeAgentLoop(AgentRun run) {
        execute(run);
    }

    public void resumeAgentLoop(UUID runId) {
        AgentRun run = agentRunRepository.findById(runId)
                .orElseThrow(() -> new IllegalArgumentException("AgentRun not found"));
        execute(run);
    }


    private void logDecision(AgentRun run, AgentDecision decision) {

        int order = (int) agentStepRepository.countByAgentRun(run) + 1;

        AgentStep step = new AgentStep();
        step.setAgentRun(run);
        step.setStepOrder(order);
        step.setDecisionType(decision.decisionType());
        step.setReasoning(decision.reasoning());
        step.setObservation(decision.observation());
        step.setMessage("AI decided: " + decision.decisionType());
        step.setModelInfo("gpt-4o-mini");

        agentStepRepository.save(step);
    }

    private void logStage(AgentRun run, String stageKey, String stageMessage) {
        int order = (int) agentStepRepository.countByAgentRun(run) + 1;

        AgentStep step = new AgentStep();
        step.setAgentRun(run);
        step.setStepOrder(order);

        // DecisionType は BUILD_PLAN のまま（設計どおり）
        step.setDecisionType(com.example.taskapp.entity.agent.AgentDecisionType.BUILD_PLAN);

        // reasoning/observation は空でもよい。UIでは message を見せればOK
        step.setReasoning(null);
        step.setObservation(null);

        step.setMessage(stageKey + " - " + stageMessage);
        step.setModelInfo("system"); // LLMではなくコード側ログ

        agentStepRepository.save(step);
    }

}

package com.example.taskapp.service.agent;

import com.example.taskapp.entity.Subtask;
import com.example.taskapp.entity.agent.AgentDecisionType;
import com.example.taskapp.entity.agent.AgentRun;
import com.example.taskapp.entity.agent.AgentRunStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AgentActionExecutorImpl implements AgentActionExecutor {

    private final AgentContextService contextService;
    private final AgentPlanBuilder planBuilder; // 新規：BUILD_PLAN実体
    private final AgentCalendarScheduler calendarScheduler; // 既存があればそれを使う
    private final SubtaskPlanningService subtaskPlanningService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final CandidateGenerator candidateGenerator = new CandidateGenerator();



    @Override
    public void execute(AgentRun run, AgentDecision decision) {

        switch (decision.decisionType()) {

            case REQUEST_USER_INPUT -> {
                run.setStatus(AgentRunStatus.WAITING_USER_INPUT);
            }

            case GENERATE_SUBTASKS -> {
                List<Subtask> subtasks = subtaskPlanningService.generate(run.getTask());
                contextService.put(run, "subtasks", subtasks);
            }

            case BUILD_PLAN -> {
                AgentPlanResult result = planBuilder.build(run);
                contextService.put(run, "plan", result);
                run.setStatus(AgentRunStatus.WAITING_FOR_APPROVAL);
            }

            case WAIT_FOR_APPROVAL -> {
                run.setStatus(AgentRunStatus.WAITING_FOR_APPROVAL);
            }

            // case EXECUTE_PLAN ->

            // {
            // try {
            // calendarScheduler.registerFromContext(run.getContextJson());
            // } catch (Exception e) {
            // throw new RuntimeException("EXECUTE_PLAN failed", e);
            // }

            // contextService.put(run, "executed", Map.of("done", true));
            // run.setStatus(AgentRunStatus.COMPLETED);
            // }

            case EXECUTE_PLAN -> {
                calendarScheduler.registerFromContext(run.getContextJson());
                contextService.put(run, "executed", Map.of("done", true));
                run.setStatus(AgentRunStatus.COMPLETED);
            }


            case COMPLETE -> {
                run.setStatus(AgentRunStatus.COMPLETED);
            }
        }
    }



}

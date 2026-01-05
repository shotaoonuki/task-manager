package com.example.taskapp.service.agent;

import com.example.taskapp.dto.agent.AgentPlanCandidateResponse;
import com.example.taskapp.dto.agent.AgentResumeRequest;
import com.example.taskapp.dto.agent.AgentRunResponse;
import com.example.taskapp.dto.agent.AgentStepResponse;
import com.example.taskapp.entity.Subtask;
import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.TaskState;
import com.example.taskapp.entity.User;
import com.example.taskapp.entity.agent.*;
import com.example.taskapp.repository.SubtaskRepository;
import com.example.taskapp.repository.TaskRepository;
import com.example.taskapp.repository.agent.AgentApprovalRepository;
import com.example.taskapp.repository.agent.AgentPlanCandidateRepository;
import com.example.taskapp.repository.agent.AgentRunRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.taskapp.repository.agent.AgentStepRepository;
import com.example.taskapp.service.OpenAIService;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.IntStream;
import com.example.taskapp.service.OpenAIService;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AgentRunService {

    private final AgentRunRepository agentRunRepository;
    private final AgentStepRepository agentStepRepository;
    private final AgentPlanCandidateRepository planCandidateRepository;
    private final AgentApprovalRepository approvalRepository;
    private final TaskRepository taskRepository;
    private final AgentContextService contextService;
    private final AgentStepRepository stepRepository;
    private final AgentCalendarScheduler calendarScheduler;
    private final SubtaskRepository subtaskRepository;
    private final OpenAIService openAIService;
    private final SubtaskPlanningService subtaskPlanningService;

    /**
     * ① AI エージェント実行開始
     */
    public AgentRun startPlanning(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        AgentRun run = new AgentRun();
        run.setTask(task);
        run.setRequestedBy(user);
        run.setStatus(AgentRunStatus.RUNNING);

        agentRunRepository.save(run);


        return run;
    }

    public void approve(UUID runId, User user) {
        AgentRun run = getRun(runId);

        if (run.getStatus() != AgentRunStatus.WAITING_FOR_APPROVAL) {
            throw new IllegalStateException("承認できない状態です");
        }

        contextService.put(run, "approved", Map.of("approvedAt", LocalDateTime.now()));

        run.setStatus(AgentRunStatus.RUNNING);
        agentRunRepository.save(run);
    }



    /**
     * ③ 人間却下（Reject）
     */
    public void reject(UUID runId, User user, String comment) {
        AgentRun run = getRun(runId);

        if (run.getStatus() != AgentRunStatus.WAITING_FOR_APPROVAL) {
            throw new IllegalStateException("却下できない状態です");
        }

        AgentApproval approval = new AgentApproval();
        approval.setAgentRun(run);
        approval.setApprovedBy(user);
        approval.setStatus(ApprovalStatus.REJECTED);
        approval.setApprovedAt(java.time.Instant.now());
        approval.setComment(comment);

        approvalRepository.save(approval);

        run.setStatus(AgentRunStatus.REJECTED);
    }

    private AgentRun getRun(UUID runId) {
        return agentRunRepository.findById(runId)
                .orElseThrow(() -> new IllegalArgumentException("AgentRun not found"));
    }

    private void logStep(AgentRun run, int order, AgentDecisionType decisionType, String reasoning,
            String observation, String message) {
        AgentStep step = new AgentStep();
        step.setAgentRun(run);
        step.setStepOrder(order);
        step.setDecisionType(decisionType);
        step.setReasoning(reasoning);
        step.setObservation(observation);
        step.setMessage(message);
        step.setModelInfo("gpt-x"); // 仮

        agentStepRepository.save(step);
    }


    // AgentRunService
    @Transactional(readOnly = true)
    public AgentRun getRunForRead(UUID runId) {
        return agentRunRepository.findById(runId)
                .orElseThrow(() -> new IllegalArgumentException("AgentRun not found"));
    }


    @Transactional(readOnly = true)
    public List<AgentPlanCandidateResponse> getCandidateResponses(UUID runId) {

        return planCandidateRepository.findByAgentRunId(runId).stream()
                .map(c -> new AgentPlanCandidateResponse(c.getId(), c.getTitle(),
                        c.getDescription(), c.getStartDate(), c.getDurationDays(), c.isAllDay(),
                        c.getPlannedSubtasks() // ★ ここが本命
                )).toList();
    }

    public List<LocalDate> generateCandidateStartDates(LocalDate baseDate) {
        return List.of(baseDate, baseDate.minusDays(1), baseDate.minusDays(2));
    }

    @Transactional(readOnly = true)
    public List<AgentStepResponse> getSteps(UUID runId) {

        AgentRun run = agentRunRepository.findById(runId)
                .orElseThrow(() -> new IllegalArgumentException("AgentRun not found"));

        return agentStepRepository.findByAgentRunOrderByStepOrderAsc(run).stream()
                .map(AgentStepResponse::from).toList();
    }

    @Transactional
    public void resume(UUID runId, AgentResumeRequest request, User user) {
        AgentRun run = getRun(runId);

        // Task 更新
        run.getTask().setDueDate(request.dueDate());

        logStep(run, 2, AgentDecisionType.REQUEST_USER_INPUT, null, null, "ユーザーが締切日を入力。計画を再開");

        run.setStatus(AgentRunStatus.RUNNING);

    }


    @Transactional(readOnly = true)
    public AgentRunResponse getRunResponse(UUID runId) {
        AgentRun run = agentRunRepository.findById(runId)
                .orElseThrow(() -> new IllegalArgumentException("AgentRun not found"));
        return AgentRunResponse.from(run);
    }


}

package com.example.taskapp.controller.agent;

import com.example.taskapp.dto.agent.AgentPlanCandidateResponse;
import com.example.taskapp.dto.agent.AgentResumeRequest;
import com.example.taskapp.dto.agent.AgentRunResponse;
import com.example.taskapp.dto.agent.AgentStepResponse;
import com.example.taskapp.entity.Subtask;
import com.example.taskapp.entity.User;
import com.example.taskapp.entity.agent.AgentPlanCandidate;
import com.example.taskapp.entity.agent.AgentRun;
import com.example.taskapp.repository.agent.AgentPlanCandidateRepository;
import com.example.taskapp.repository.agent.AgentRunRepository;
import com.example.taskapp.service.agent.AgentContextJsonParser;
import com.example.taskapp.service.agent.AgentLoopExecutor;
import com.example.taskapp.service.agent.AgentRunService;
import com.example.taskapp.service.agent.AgentStepQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/agent-runs")
@RequiredArgsConstructor
public class AgentRunController {

    private final AgentRunService agentRunService;
    private final AgentLoopExecutor agentLoopExecutor;
    private final AgentRunRepository agentRunRepository;
    private final AgentContextJsonParser contextJsonParser;
    private final AgentStepQueryService agentStepQueryService;

    // 仮：認証未実装なのでダミー
    private User dummyUser() {
        User u = new User();
        u.setId(1L);
        return u;
    }

    @PostMapping("/start")
    public UUID start(@RequestParam Long taskId) {

        AgentRun run = agentRunService.startPlanning(taskId, dummyUser());

        // ★ ここを追加
        agentLoopExecutor.executeAgentLoop(run);

        return run.getId();
    }


    @PostMapping("/{runId}/approve")
    public void approve(@PathVariable UUID runId) {
        agentRunService.approve(runId, dummyUser());
        agentLoopExecutor.resumeAgentLoop(runId);
    }



    @PostMapping("/{runId}/reject")
    public void reject(@PathVariable UUID runId, @RequestParam String comment) {
        agentRunService.reject(runId, dummyUser(), comment);
    }

    @GetMapping("/{runId}/candidates")
    public List<AgentPlanCandidateResponse> getCandidates(@PathVariable UUID runId) {
        AgentRun run = agentRunRepository.findById(runId).orElseThrow();

        return contextJsonParser.extractCandidates(run.getContextJson());
    }


    @GetMapping("/{runId}/steps")
    public List<AgentStepResponse> getSteps(@PathVariable UUID runId) {
        return agentStepQueryService.getSteps(runId);
    }

    @GetMapping("/{runId}")
    public AgentRunResponse getRun(@PathVariable UUID runId) {
        return agentRunService.getRunResponse(runId);
    }

    @PostMapping("/{agentRunId}/resume")
    public void resume(@PathVariable UUID agentRunId) {
        agentLoopExecutor.resumeAgentLoop(agentRunId);
    }
}


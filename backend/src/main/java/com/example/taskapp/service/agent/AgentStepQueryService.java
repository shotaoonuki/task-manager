package com.example.taskapp.service.agent;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.example.taskapp.entity.agent.AgentRun;
import com.example.taskapp.dto.agent.AgentStepResponse;
import com.example.taskapp.repository.agent.AgentRunRepository;
import com.example.taskapp.repository.agent.AgentStepRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AgentStepQueryService {

    private final AgentRunRepository agentRunRepository;
    private final AgentStepRepository agentStepRepository;

    public List<AgentStepResponse> getSteps(UUID runId) {

        AgentRun run = agentRunRepository.findById(runId)
                .orElseThrow(() -> new IllegalArgumentException("AgentRun not found"));

        return agentStepRepository.findByAgentRunOrderByStepOrderAsc(run).stream()
                .map(AgentStepResponse::from).toList();
    }
}

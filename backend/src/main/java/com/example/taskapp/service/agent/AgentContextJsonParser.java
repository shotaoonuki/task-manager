package com.example.taskapp.service.agent;

import com.example.taskapp.dto.agent.AgentPlanCandidateResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class AgentContextJsonParser {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<AgentPlanCandidateResponse> extractCandidates(String contextJson) {
        if (contextJson == null || contextJson.isBlank()) {
            return List.of();
        }

        try {
            JsonNode root = objectMapper.readTree(contextJson);

            // 今回は buildPlanSteps を UI 表示用に変換（仮）
            JsonNode steps = root.path("execution").path("buildPlanSteps");

            List<AgentPlanCandidateResponse> results = new ArrayList<>();

            for (int i = 0; i < steps.size(); i++) {
                JsonNode step = steps.get(i);

                results.add(new AgentPlanCandidateResponse(UUID.randomUUID(), // 仮ID
                        step.path("step").asText(), step.path("message").asText(), LocalDate.now(), // 仮
                        1, true, List.of(step.path("message").asText())));
            }

            return results;

        } catch (Exception e) {
            throw new IllegalStateException("Failed to parse contextJson", e);
        }
    }
}

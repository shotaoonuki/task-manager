package com.example.taskapp.service.agent;

import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.agent.AgentPlanCandidate;
import com.example.taskapp.entity.agent.AgentRun;
import com.example.taskapp.service.calendar.GoogleCalendarService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.api.client.util.DateTime;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AgentCalendarScheduler {

    private final GoogleCalendarService calendarService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AgentCalendarScheduler(GoogleCalendarService calendarService) {
        this.calendarService = calendarService;
    }

    public void scheduleApprovedRun(AgentPlanCandidate candidate) {

        String description =
                candidate.getDescription() + "\n\n" + "【実行プラン】\n"
                        + IntStream.range(0, candidate.getPlannedSubtasks().size()).mapToObj(
                                i -> "Day " + (i + 1) + "：" + candidate.getPlannedSubtasks().get(i))
                                .collect(Collectors.joining("\n"));
        try {
            calendarService.createAllDayEvent(candidate.getTitle(), description,
                    candidate.getStartDate(),
                    candidate.getStartDate().plusDays(candidate.getDurationDays()));
        } catch (Exception e) {
            throw new RuntimeException("Google Calendar 登録失敗", e);
        }
    }

    public void registerFromContext(String contextJson) {

        try {
            ObjectNode root = (ObjectNode) objectMapper.readTree(contextJson);
            JsonNode plan = root.get("plan");
            JsonNode candidates = plan.get("candidates");

            if (candidates == null || !candidates.isArray() || candidates.isEmpty()) {
                throw new IllegalStateException("No candidates found in contextJson");
            }

            LocalDate startDate = LocalDate.parse(candidates.get(0).asText());

            calendarService.createAllDayEvent("Task Execution", "AI planned task", startDate,
                    startDate.plusDays(1));

        } catch (Exception e) {
            throw new RuntimeException("Failed to register calendar from contextJson", e);
        }
    }



}


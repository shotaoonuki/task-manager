package com.example.taskapp.dto.agent;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record AgentPlanCandidateResponse(UUID id, String title, String description,
        LocalDate startDate, int durationDays, boolean allDay, List<String> plannedSubtasks) {
}

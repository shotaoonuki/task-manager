package com.example.taskapp.dto.agent;

import java.time.LocalDate;
import java.util.List;

/**
 * BUILD_PLAN の最小成果物 （Lv3.5ではこれで十分）
 */
public record AgentPlanResult(LocalDate dueDate, List<LocalDate> candidateStartDates) {
}

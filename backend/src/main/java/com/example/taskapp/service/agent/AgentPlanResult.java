package com.example.taskapp.service.agent;

import java.time.LocalDate;
import java.util.List;

/**
 * BUILD_PLAN の最終結果 - plan: 計画の要約（将来拡張用） - candidates: UIに出す着手候補日
 */
public record AgentPlanResult(SimplePlan plan, List<LocalDate> candidates) {
}

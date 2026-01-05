package com.example.taskapp.service.agent;

import java.time.LocalDate;
import java.util.List;

/**
 * 最小構成の Plan BUILD_PLAN の多段階結果をまとめたもの
 */
public record SimplePlan(String version, List<LocalDate> candidateStartDates) {
}


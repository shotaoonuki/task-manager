package com.example.taskapp.service.agent;

import com.example.taskapp.entity.agent.AgentRun;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentPlanBuilder {

    private final AgentStepLogger stepLogger; // 新規（AgentStepRepository に書く専用）
    private final CandidateGenerator candidateGenerator; // 既存 or 新規

    public AgentPlanResult build(AgentRun run) {

        stepLogger.stage(run, "STAGE_1", "サブタスク依存関係を分析");
        // TODO: analyze dependencies（今はダミーでOK）

        stepLogger.stage(run, "STAGE_2", "カレンダー取得");
        // TODO: fetch calendar（将来）

        stepLogger.stage(run, "STAGE_3", "サブタスク配置");
        // TODO: schedule subtasks（将来）

        stepLogger.stage(run, "STAGE_4", "実行可能性評価");
        // TODO: evaluate feasibility（将来）

        stepLogger.stage(run, "STAGE_5", "最終提案生成");
        // 最小実装：候補日を作って返す（あなたの現状機能に合わせる）
        List<LocalDate> candidates = candidateGenerator.generate(run.getTask().getDueDate());

        // plan は「今の時点の最小構造」でOK（後で拡張）
        SimplePlan plan = new SimplePlan("v1-plan", candidates);

        return new AgentPlanResult(plan, candidates);
    }
}

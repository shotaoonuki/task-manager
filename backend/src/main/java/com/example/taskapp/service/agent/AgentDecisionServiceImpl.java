package com.example.taskapp.service.agent;

import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.agent.AgentDecisionType;
import com.example.taskapp.entity.agent.AgentRun;
import com.example.taskapp.entity.agent.AgentRunStatus;
import com.example.taskapp.entity.agent.AgentStep;
import com.example.taskapp.repository.agent.AgentStepRepository;
import com.example.taskapp.service.OpenAIService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AgentDecisionServiceImpl implements AgentDecisionService {

    private final OpenAIService openAIService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final AgentStepRepository agentStepRepository;


    @Override
    public AgentDecision decideNext(AgentRun run) {

        // ① 人間待ち中は LLM を呼ばない
        if (run.getStatus() == AgentRunStatus.WAITING_FOR_APPROVAL) {
            return new AgentDecision(AgentDecisionType.WAIT_FOR_APPROVAL,
                    "Waiting for user approval", "user has not approved yet");
        }

        // ② 承認後だけ EXECUTE_PLAN
        if (isApproved(run) && !isExecuted(run)) {
            return new AgentDecision(AgentDecisionType.EXECUTE_PLAN, "Plan approved, executing",
                    "approved flag found");
        }

        // ★ ② それ以外だけ LLM に聞く
        String prompt = buildPrompt(run);

        try {
            String json = openAIService.chat(prompt);
            LlmDecisionResponse res = objectMapper.readValue(json, LlmDecisionResponse.class);
            return validateAndConvert(run, res);

        } catch (Exception e) {
            return fallback(run, "LLM failure: " + e.getMessage());
        }
    }


    /* ---------------- private ---------------- */

    private String buildPrompt(AgentRun run) {
        Task task = run.getTask();
        String stepSummary = buildStepSummary(run);

        return """
                あなたは「制御付きAIエージェント」の判断モジュールです。
                あなたの役割は「次に取るべき行動（DecisionType）を1つだけ選ぶ」ことです。
                状態遷移・DB更新・副作用はすべてアプリ側が行います。

                # 現在の状態
                - status: %s

                # Task
                - id: %d
                - title: %s
                - dueDate: %s

                # 過去の判断履歴（直近）
                %s

                # 選択可能な DecisionType
                - REQUEST_USER_INPUT
                - GENERATE_SUBTASKS
                - BUILD_PLAN
                - WAIT_FOR_APPROVAL
                - EXECUTE_PLAN
                - COMPLETE

                # 制約
                - status が WAITING_FOR_APPROVAL の場合は WAIT_FOR_APPROVAL のみ選択可能
                - dueDate が null の場合は REQUEST_USER_INPUT を優先
                - 計画未作成なら BUILD_PLAN
                - 承認済みなら EXECUTE_PLAN
                - 完了済みなら COMPLETE

                # 出力形式（JSONのみ）
                {
                  "decision": "BUILD_PLAN",
                  "reasoning": "なぜその判断をしたか",
                  "observation": "現在の状況要約"
                }
                """.formatted(run.getStatus(), task.getId(), safe(task.getTitle()),
                task.getDueDate(), stepSummary);
    }



    private boolean isAllowed(AgentRun run, AgentDecisionType type) {
        AgentRunStatus status = run.getStatus();

        // 完了後だけガード
        if (status.isTerminal()) {
            return type == AgentDecisionType.COMPLETE;
        }

        return true;
    }



    private AgentDecision fallback(AgentRun run, String reason) {
        if (run.getTask().getDueDate() == null) {
            return new AgentDecision(AgentDecisionType.REQUEST_USER_INPUT, reason,
                    "dueDate missing");
        }
        return new AgentDecision(AgentDecisionType.BUILD_PLAN, reason, "fallback build plan");
    }

    private String safe(String s) {
        return s == null ? "" : s.replace("\n", " ");
    }

    private String buildStepSummary(AgentRun run) {

        List<AgentStep> steps = agentStepRepository.findTop5ByAgentRunOrderByCreatedAtDesc(run);

        if (steps.isEmpty()) {
            return "（過去の判断ログなし）";
        }

        StringBuilder sb = new StringBuilder();

        for (AgentStep step : steps) {
            sb.append("- [").append(step.getDecisionType()).append("] ").append(step.getReasoning())
                    .append("\n");
        }

        return sb.toString();
    }

    private AgentDecision validateAndConvert(AgentRun run, LlmDecisionResponse res) {

        // decision null / empty
        if (res.decision() == null || res.decision().isBlank()) {
            return fallback(run, "decision is empty");
        }

        AgentDecisionType type;
        try {
            type = AgentDecisionType.valueOf(res.decision());
        } catch (IllegalArgumentException e) {
            return fallback(run, "unknown decision: " + res.decision());
        }

        // reasoning / observation 正規化（数値・空対策）
        String reasoning = normalizeText(res.reasoning());
        String observation = normalizeText(res.observation());

        if (reasoning.isBlank()) {
            reasoning = "AIは現在の状況をもとに次の行動を判断しました";
        }
        if (observation.isBlank()) {
            observation = "タスク内容と進行状況を確認しています";
        }


        // 状態遷移ガード（設計どおり）
        if (!isAllowed(run, type)) {
            return fallback(run, "Decision not allowed in state: " + run.getStatus());
        }

        return new AgentDecision(type, reasoning, observation);
    }

    private boolean isApproved(AgentRun run) {
        try {
            JsonNode ctx = objectMapper.readTree(run.getContextJson());
            return ctx.has("approved");
        } catch (Exception e) {
            return false;
        }
    }



    private boolean isExecuted(AgentRun run) {
        try {
            JsonNode ctx = objectMapper.readTree(run.getContextJson());
            return ctx.has("executed");
        } catch (Exception e) {
            return false;
        }
    }

    private String normalizeText(String s) {
        if (s == null) {
            return "";
        }

        String trimmed = s.replace("\n", " ").trim();

        // 数字だけ（例: "16992"）は無効扱い
        if (trimmed.matches("^\\d+$")) {
            return "";
        }

        return trimmed;
    }


}

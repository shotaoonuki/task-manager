package com.example.taskapp.service;

import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

import com.example.taskapp.dto.TaskAiDecisionResponse;
import com.example.taskapp.entity.AiDecisionLog;
import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.TaskState;
import com.example.taskapp.service.OpenAIService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.taskapp.dto.TaskAiDecisionResponse;
import com.example.taskapp.dto.TaskAiDecisionOpenAiResponse;
import com.example.taskapp.repository.AiDecisionLogRepository;
import java.util.List;



@Service
public class TaskAiDecisionService {

    private final OpenAIService openAIService;
    private final AiDecisionLogRepository aiDecisionLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TaskAiDecisionService(OpenAIService openAIService,
            AiDecisionLogRepository aiDecisionLogRepository) {
        this.openAIService = openAIService;
        this.aiDecisionLogRepository = aiDecisionLogRepository;
    }

    public TaskAiDecisionResponse decide(Task task) {

        TaskAiDecisionResponse res;

        try {
            String prompt = buildPrompt(task);
            String raw = openAIService.chat(prompt);

            TaskAiDecisionOpenAiResponse ai =
                    objectMapper.readValue(raw, TaskAiDecisionOpenAiResponse.class);

            res = new TaskAiDecisionResponse();
            res.setNextState(ai.getNextState());
            res.setReason(ai.getReason());

        } catch (Exception e) {
            // AI失敗時も必ず結果を返す
            res = fallback(task);
        }

        // ★ 成功・失敗に関わらず必ずログ保存
        saveLog(task, res);

        return res;
    }

    private void saveLog(Task task, TaskAiDecisionResponse res) {
        try {
            AiDecisionLog log = new AiDecisionLog();
            log.setTaskId(task.getId());
            log.setSuggestedState(res.getNextState());
            log.setReason(res.getReason());
            log.setCreatedAt(LocalDateTime.now());

            aiDecisionLogRepository.save(log);
        } catch (Exception e) {
            // ログ保存失敗では業務を止めない（実務的に重要）
        }
    }

    private String buildPrompt(Task task) {
        return String.format(
                "You are a task management AI.\n\n" + "Return ONLY valid JSON.\n\n"
                        + "Allowed nextState values: PENDING, EXECUTING, DONE\n\n" + "Task:\n"
                        + "- title: %s\n" + "- priority: %s\n" + "- dueDate: %s\n"
                        + "- currentState: %s\n\n" + "Rules:\n" + "- If already DONE, keep DONE.\n"
                        + "- Prefer EXECUTING if priority is high and dueDate is near.\n"
                        + "- Provide a concise Japanese reason.\n\n" + "Output format:\n"
                        + "{ \"nextState\": \"EXECUTING\", \"reason\": \"理由\" }",
                task.getTitle(), task.getPriority(), task.getDueDate(), task.getState());
    }

    private TaskAiDecisionResponse fallback(Task task) {
        TaskAiDecisionResponse res = new TaskAiDecisionResponse();

        if (task.getState() == TaskState.PENDING && "high".equals(task.getPriority())) {
            res.setNextState(TaskState.EXECUTING);
            res.setReason("優先度が高いため、今すぐ着手すべきと判断しました。");
        } else {
            res.setNextState(task.getState());
            res.setReason("現状の状態を維持します。");
        }
        return res;
    }

    public List<AiDecisionLog> getLogsByTaskId(Long taskId) {
        return aiDecisionLogRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
    }

}

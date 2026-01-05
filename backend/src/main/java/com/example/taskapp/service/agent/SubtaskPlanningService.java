package com.example.taskapp.service.agent;

import java.util.List;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.Subtask;
import com.example.taskapp.service.OpenAIService;

@Service
@RequiredArgsConstructor
public class SubtaskPlanningService {

    private final OpenAIService openAIService;

    /**
     * サブタスク生成（Lv3.5では最小実装でOK）
     */
    public List<Subtask> generate(Task task) {

        // 最小構成：Task から仮サブタスクを作る
        Subtask s1 = new Subtask();
        s1.setTitle("タスク内容を整理する");
        s1.setTask(task);

        Subtask s2 = new Subtask();
        s2.setTitle("作業を実行する");
        s2.setTask(task);

        return List.of(s1, s2);
    }

    /**
     * 既存：並び替え（将来用）
     */
    public List<String> prioritize(List<String> subtasks) {
        if (subtasks == null || subtasks.isEmpty()) {
            return List.of("タスクを進める");
        }

        try {
            return openAIService.prioritizeSubtasks(subtasks);
        } catch (RuntimeException e) {
            return subtasks; // フェイルセーフ
        }
    }
}

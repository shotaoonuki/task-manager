package com.example.taskapp.controller;

import com.example.taskapp.dto.GenerateSubtasksRequest;
import com.example.taskapp.dto.SubtaskResponse;
import com.example.taskapp.entity.Subtask;
import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.User;
import com.example.taskapp.repository.SubtaskRepository;
import com.example.taskapp.repository.TaskRepository;
import com.example.taskapp.repository.UserRepository;
import com.example.taskapp.service.OpenAIService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class SubtaskController {

    private final OpenAIService openAIService;
    private final SubtaskRepository subtaskRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public SubtaskController(OpenAIService openAIService,
                            SubtaskRepository subtaskRepository,
                            TaskRepository taskRepository,
                            UserRepository userRepository) {
        this.openAIService = openAIService;
        this.subtaskRepository = subtaskRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{taskId}/subtasks/generate")
    public List<SubtaskResponse> generateSubtasks(
            @PathVariable Long taskId,
            @RequestBody GenerateSubtasksRequest request) {
        
        try {
            // ログイン状態に関わらずタスクを取得
            User user = getCurrentUserOrNull();
            Task task = user != null
                    ? taskRepository.findByIdAndUser(taskId, user)
                            .orElseThrow(() -> new RuntimeException("Task not found or no permission"))
                    : taskRepository.findByIdAndUser(taskId, null)
                            .orElseThrow(() -> new RuntimeException("Task not found"));

            // OpenAI APIでサブタスクを生成
            List<String> subtaskTitles;
            try {
                subtaskTitles = openAIService.generateSubtasks(
                        request.getTaskTitle() != null ? request.getTaskTitle() : task.getTitle(),
                        request.getTaskDescription() != null ? request.getTaskDescription() : task.getDescription()
                );
            } catch (RuntimeException e) {
                // OpenAI APIエラーの場合、デフォルトのサブタスクを生成
                String taskTitle = request.getTaskTitle() != null ? request.getTaskTitle() : task.getTitle();
                subtaskTitles = List.of(
                    taskTitle + "の準備",
                    taskTitle + "の実行",
                    taskTitle + "の確認"
                );
                // エラーログを出力（本番環境ではログシステムを使用）
                System.err.println("OpenAI API Error: " + e.getMessage());
                e.printStackTrace();
            }

            // 既存のサブタスクを削除（オプション：既存を保持したい場合は削除しない）
            // subtaskRepository.deleteByTask(task);

            // サブタスクを保存
            List<Subtask> subtasks = subtaskTitles.stream()
                    .map(title -> {
                        Subtask subtask = new Subtask();
                        subtask.setTitle(title);
                        subtask.setCompleted(false);
                        subtask.setTask(task);
                        return subtaskRepository.save(subtask);
                    })
                    .collect(Collectors.toList());

            // レスポンスに変換
            return subtasks.stream()
                    .map(st -> {
                        SubtaskResponse response = new SubtaskResponse();
                        response.setId(st.getId());
                        response.setTitle(st.getTitle());
                        response.setCompleted(st.isCompleted());
                        response.setTaskId(st.getTask().getId());
                        return response;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // エラーの詳細をログに出力
            System.err.println("Error in generateSubtasks: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("サブタスクの生成に失敗しました: " + e.getMessage(), e);
        }
    }

    @GetMapping("/{taskId}/subtasks")
    public List<SubtaskResponse> getSubtasks(@PathVariable Long taskId) {
        // ログイン状態に関わらずタスクを取得
        User user = getCurrentUserOrNull();
        Task task = user != null
                ? taskRepository.findByIdAndUser(taskId, user)
                        .orElseThrow(() -> new RuntimeException("Task not found or no permission"))
                : taskRepository.findByIdAndUser(taskId, null)
                        .orElseThrow(() -> new RuntimeException("Task not found"));

        return subtaskRepository.findByTask(task).stream()
                .map(st -> {
                    SubtaskResponse response = new SubtaskResponse();
                    response.setId(st.getId());
                    response.setTitle(st.getTitle());
                    response.setCompleted(st.isCompleted());
                    response.setTaskId(st.getTask().getId());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @PutMapping("/{taskId}/subtasks/{subtaskId}")
    public SubtaskResponse updateSubtask(
            @PathVariable Long taskId,
            @PathVariable Long subtaskId,
            @RequestBody SubtaskResponse request) {
        
        // ログイン状態に関わらずタスクを取得
        User user = getCurrentUserOrNull();
        Task task = user != null
                ? taskRepository.findByIdAndUser(taskId, user)
                        .orElseThrow(() -> new RuntimeException("Task not found or no permission"))
                : taskRepository.findByIdAndUser(taskId, null)
                        .orElseThrow(() -> new RuntimeException("Task not found"));

        Subtask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));

        if (!subtask.getTask().getId().equals(task.getId())) {
            throw new RuntimeException("Subtask does not belong to this task");
        }

        subtask.setTitle(request.getTitle());
        subtask.setCompleted(request.isCompleted());
        subtaskRepository.save(subtask);

        SubtaskResponse response = new SubtaskResponse();
        response.setId(subtask.getId());
        response.setTitle(subtask.getTitle());
        response.setCompleted(subtask.isCompleted());
        response.setTaskId(subtask.getTask().getId());
        return response;
    }

    @DeleteMapping("/{taskId}/subtasks/{subtaskId}")
    public void deleteSubtask(@PathVariable Long taskId, @PathVariable Long subtaskId) {
        // ログイン状態に関わらずタスクを取得
        User user = getCurrentUserOrNull();
        Task task = user != null
                ? taskRepository.findByIdAndUser(taskId, user)
                        .orElseThrow(() -> new RuntimeException("Task not found or no permission"))
                : taskRepository.findByIdAndUser(taskId, null)
                        .orElseThrow(() -> new RuntimeException("Task not found"));

        Subtask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));

        if (!subtask.getTask().getId().equals(task.getId())) {
            throw new RuntimeException("Subtask does not belong to this task");
        }

        subtaskRepository.delete(subtask);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }

        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private User getCurrentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }
}


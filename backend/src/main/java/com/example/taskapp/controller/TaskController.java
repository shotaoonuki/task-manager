package com.example.taskapp.controller;

import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.User;
import com.example.taskapp.repository.SubtaskRepository;
import com.example.taskapp.repository.TaskRepository;
import com.example.taskapp.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import com.example.taskapp.entity.Subtask;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SubtaskRepository subtaskRepository;

    public TaskController(TaskRepository taskRepository,
                          UserRepository userRepository,
                          SubtaskRepository subtaskRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.subtaskRepository = subtaskRepository;
    }

    // ==========================================
    // 🔹 ログイン中ユーザー用 API
    // ==========================================

    @GetMapping
    public List<Task> getAllTasks() {
        User user = getCurrentUser();
        return taskRepository.findByUser(user);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        User user = getCurrentUser();
        task.setUser(user);
        task.setCreatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id,
                           @RequestBody Task updatedTask) {

        User user = getCurrentUser();

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found or no permission"));

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setCompleted(updatedTask.isCompleted());
        task.setDueDate(updatedTask.getDueDate());
        task.setPriority(updatedTask.getPriority());

        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        try {
            User user = getCurrentUser();

            Task task = taskRepository.findByIdAndUser(id, user)
                    .orElseThrow(() -> new RuntimeException("Task not found or no permission"));

            // サブタスクを先に削除（明示的にリストを取得してから削除）
            try {
                List<Subtask> subtasks = subtaskRepository.findByTask(task);
                if (subtasks != null && !subtasks.isEmpty()) {
                    subtaskRepository.deleteAll(subtasks);
                }
            } catch (Exception e) {
                // サブタスクが存在しない場合でも続行
                System.err.println("Warning: Failed to delete subtasks: " + e.getMessage());
                e.printStackTrace();
            }
            
            // その後、タスクを削除
            taskRepository.delete(task);
        } catch (Exception e) {
            System.err.println("Error deleting task: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("タスクの削除に失敗しました: " + e.getMessage(), e);
        }
    }

    // ==========================================
    // 👤 ゲスト（非ログイン）用 API
    // ==========================================

    @GetMapping("/public")
    public List<Task> getPublicTasks() {
        return taskRepository.findByUser(null);
    }

    @PostMapping("/public")
    public Task createPublicTask(@RequestBody Task task) {
        task.setUser(null);
        task.setCreatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @PutMapping("/public/{id}")
    public Task updatePublicTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task task = taskRepository.findByIdAndUser(id, null)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setCompleted(updatedTask.isCompleted());
        task.setDueDate(updatedTask.getDueDate());
        task.setPriority(updatedTask.getPriority());

        return taskRepository.save(task);
    }

    @DeleteMapping("/public/{id}")
    public void deletePublicTask(@PathVariable Long id) {
        try {
            Task task = taskRepository.findByIdAndUser(id, null)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            // サブタスクを先に削除（明示的にリストを取得してから削除）
            try {
                List<com.example.taskapp.entity.Subtask> subtasks = subtaskRepository.findByTask(task);
                if (subtasks != null && !subtasks.isEmpty()) {
                    subtaskRepository.deleteAll(subtasks);
                }
            } catch (Exception e) {
                // サブタスクが存在しない場合でも続行
                System.err.println("Warning: Failed to delete subtasks: " + e.getMessage());
                e.printStackTrace();
            }
            
            // その後、タスクを削除
            taskRepository.delete(task);
        } catch (Exception e) {
            System.err.println("Error deleting task: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("タスクの削除に失敗しました: " + e.getMessage(), e);
        }
    }

    // ==========================================
    // 共通：ログイン中ユーザー取得
    // ==========================================
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthenticated");
        }

        String email = auth.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

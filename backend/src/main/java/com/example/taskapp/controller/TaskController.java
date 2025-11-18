package com.example.taskapp.controller;

import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.User;
import com.example.taskapp.repository.TaskRepository;
import com.example.taskapp.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository,
                          UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
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
        User user = getCurrentUser();

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found or no permission"));

        taskRepository.delete(task);
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
        Task task = taskRepository.findByIdAndUser(id, null)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        taskRepository.delete(task);
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

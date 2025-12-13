package com.example.taskapp.controller;

import com.example.taskapp.dto.TaskAiDecisionResponse;
import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.User;
import com.example.taskapp.repository.TaskRepository;
import com.example.taskapp.repository.UserRepository;
import com.example.taskapp.service.TaskAiDecisionService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskAiDecisionController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskAiDecisionService taskAiDecisionService;

    public TaskAiDecisionController(TaskRepository taskRepository, UserRepository userRepository,
            TaskAiDecisionService taskAiDecisionService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskAiDecisionService = taskAiDecisionService;
    }

    // 🤖 AIに相談
    @PostMapping("/{taskId}/ai/decision")
    public TaskAiDecisionResponse decide(@PathVariable Long taskId) {
        User user = getCurrentUserOrNull();

        Task task = user != null
                ? taskRepository.findByIdAndUser(taskId, user)
                        .orElseThrow(() -> new RuntimeException("Task not found or no permission"))
                : taskRepository.findByIdAndUser(taskId, null)
                        .orElseThrow(() -> new RuntimeException("Task not found"));

        return taskAiDecisionService.decide(task);
    }

    private User getCurrentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }
}

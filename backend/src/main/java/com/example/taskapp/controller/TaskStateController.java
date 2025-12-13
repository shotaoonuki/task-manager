package com.example.taskapp.controller;

import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.TaskState;
import com.example.taskapp.entity.User;
import com.example.taskapp.repository.TaskRepository;
import com.example.taskapp.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskStateController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskStateController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @PutMapping("/{taskId}/state")
    public Task updateState(@PathVariable Long taskId,
            @RequestBody UpdateTaskStateRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Task task;

        if (auth != null && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal())) {

            User user = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            task = taskRepository.findByIdAndUser(taskId, user)
                    .orElseThrow(() -> new RuntimeException("Task not found or no permission"));

        } else {
            // 🔥 public タスク用
            task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found"));
        }

        task.setState(request.getState());
        return taskRepository.save(task);
    }



    private User getCurrentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    // DTO（Controller 内でOK）
    public static class UpdateTaskStateRequest {
        private TaskState state;

        public TaskState getState() {
            return state;
        }

        public void setState(TaskState state) {
            this.state = state;
        }
    }
}

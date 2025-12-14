package com.example.taskapp.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.taskapp.dto.CreateTaskRequest;
import com.example.taskapp.entity.Task;
import com.example.taskapp.entity.TaskState;
import com.example.taskapp.entity.User;
import com.example.taskapp.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // タスク作成
    public Task createTask(CreateTaskRequest request, User user) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());

        // ★ ここが今回の本命
        task.setState(TaskState.PENDING);

        // 既存仕様との互換
        task.setCompleted(false);

        task.setUser(user);
        task.setCreatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    // タスク取得（AI判断用）
    public Task findById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("タスクが見つかりません"));
    }
}

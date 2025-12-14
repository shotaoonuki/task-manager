package com.example.taskapp.dto;

import java.time.LocalDate;

import com.example.taskapp.entity.TaskState;

public class TaskAiDecisionRequest {

    private String title;
    private String description;
    private String priority;
    private LocalDate dueDate;
    private TaskState currentState;
}

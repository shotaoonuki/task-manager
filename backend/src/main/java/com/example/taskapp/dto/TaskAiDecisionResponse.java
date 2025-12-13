package com.example.taskapp.dto;

import com.example.taskapp.entity.TaskState;

import lombok.Data;

@Data
public class TaskAiDecisionResponse {
    private TaskState nextState;
    private String reason;
}

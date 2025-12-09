package com.example.taskapp.dto;

import lombok.Data;

@Data
public class GenerateSubtasksRequest {
    private String taskTitle;
    private String taskDescription;
}


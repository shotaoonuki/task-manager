package com.example.taskapp.dto;

import lombok.Data;

@Data
public class SubtaskResponse {
    private Long id;
    private String title;
    private boolean completed;
    private Long taskId;
}


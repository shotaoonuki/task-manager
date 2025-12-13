package com.example.taskapp.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CreateTaskRequest {

    private String title;
    private String description;
    private LocalDate dueDate;
    private String priority;
}

package com.example.taskapp.dto;

import com.example.taskapp.entity.TaskState;
import lombok.Data;

@Data
public class UpdateStateRequest {
    private TaskState state;
}

package com.example.taskapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.taskapp.entity.AiDecisionLog;
import com.example.taskapp.service.AiDecisionLogService;

@RestController
@RequestMapping("/api/tasks/{taskId}/ai/logs")
public class AiDecisionLogController {

    private final AiDecisionLogService service;

    public AiDecisionLogController(AiDecisionLogService service) {
        this.service = service;
    }

    @GetMapping
    public List<AiDecisionLog> getLogs(@PathVariable Long taskId) {
        return service.getLogsByTaskId(taskId);
    }
}

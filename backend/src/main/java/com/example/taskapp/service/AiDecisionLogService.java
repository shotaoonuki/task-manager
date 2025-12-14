package com.example.taskapp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.taskapp.entity.AiDecisionLog;
import com.example.taskapp.repository.AiDecisionLogRepository;

@Service
public class AiDecisionLogService {

    private final AiDecisionLogRepository repository;

    public AiDecisionLogService(AiDecisionLogRepository repository) {
        this.repository = repository;
    }

    public List<AiDecisionLog> getLogsByTaskId(Long taskId) {
        return repository.findByTaskIdOrderByCreatedAtDesc(taskId);
    }
}

package com.example.taskapp.service.agent;

public record LlmDecisionResponse(String decision, String reasoning, String observation) {
}

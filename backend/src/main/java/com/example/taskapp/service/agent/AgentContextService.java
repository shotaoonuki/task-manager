package com.example.taskapp.service.agent;

import com.example.taskapp.entity.agent.AgentRun;
import com.example.taskapp.repository.agent.AgentRunRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AgentContextService {

    private final ObjectMapper objectMapper;
    private final AgentRunRepository agentRunRepository;

    public void put(AgentRun run, String key, Object value) {
        ObjectNode ctx = parse(run.getContextJson());
        ctx.set(key, objectMapper.valueToTree(value));
        run.setContextJson(ctx.toString());
        agentRunRepository.save(run); // 設計どおり「更新はコード責務」で永続化
    }

    public ObjectNode parse(String json) {
        try {
            if (json == null || json.isBlank()) {
                return objectMapper.createObjectNode();
            }
            return (ObjectNode) objectMapper.readTree(json);
        } catch (Exception e) {
            // 壊れてても落とさず、新規に作り直す（運用上強い）
            return objectMapper.createObjectNode();
        }
    }
}

package com.example.taskapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class OpenAIService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${OPENAI_API_KEY:}")
    private String apiKey;

    public OpenAIService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public List<String> generateSubtasks(String taskTitle, String taskDescription) {
        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("警告: OpenAI API keyが設定されていません。デフォルトのサブタスクを生成します。");
            throw new RuntimeException("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.");
        }

        String prompt = String.format(
            "以下のタスクに対して、実行可能なサブタスクを3つ提案してください。\n\n" +
            "タスク名: %s\n" +
            "%s\n\n" +
            "サブタスクは簡潔で具体的にしてください。JSON配列形式で返してください。\n" +
            "例: [\"サブタスク1\", \"サブタスク2\", \"サブタスク3\"]",
            taskTitle,
            taskDescription != null && !taskDescription.isEmpty() 
                ? "説明: " + taskDescription 
                : ""
        );

        // Jacksonを使ってJSONリクエストボディを構築
        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("temperature", 0.7);
        requestBody.put("max_tokens", 200);

        ArrayNode messages = objectMapper.createArrayNode();
        
        ObjectNode systemMessage = objectMapper.createObjectNode();
        systemMessage.put("role", "system");
        systemMessage.put("content", "あなたはタスク管理の専門家です。与えられたタスクから、実行可能なサブタスクを3つ提案してください。JSON配列形式で返してください。例: [\"サブタスク1\", \"サブタスク2\", \"サブタスク3\"]");
        messages.add(systemMessage);

        ObjectNode userMessage = objectMapper.createObjectNode();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(userMessage);

        requestBody.set("messages", messages);

        try {
            String requestBodyJson = objectMapper.writeValueAsString(requestBody);
            
            String response = webClient.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .bodyValue(requestBodyJson)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            String content = jsonNode.get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

            // JSON配列をパース
            content = content.trim();
            if (content.startsWith("[")) {
                JsonNode arrayNode = objectMapper.readTree(content);
                List<String> subtasks = new ArrayList<>();
                for (JsonNode item : arrayNode) {
                    subtasks.add(item.asText());
                }
                return subtasks;
            } else {
                // JSON配列でない場合、改行で分割
                String[] lines = content.split("\n");
                List<String> subtasks = new ArrayList<>();
                for (String line : lines) {
                    line = line.trim();
                    if (line.startsWith("-") || line.matches("^\\d+\\.\\s*.*")) {
                        line = line.replaceFirst("^[-\\d\\.\\s]+", "").trim();
                    }
                    if (!line.isEmpty() && subtasks.size() < 3) {
                        subtasks.add(line);
                    }
                }
                return subtasks.size() > 0 ? subtasks : List.of("サブタスク1", "サブタスク2", "サブタスク3");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate subtasks: " + e.getMessage(), e);
        }
    }
}


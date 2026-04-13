package com.dsareviewer.dsa_reviewer.service;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    private String apiToken = "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";

    @Value("${groq.api.url}")
    private String apiUrl;

    private final WebClient webClient;

    public GroqService(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    public String reviewCode(String code, String language,
                             String problemDescription) {
        String prompt = buildPrompt(code, language, problemDescription);

        Map<String, Object> requestBody = Map.of(
                "model", "openai/gpt-oss-120b",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", 1024
        );

        return webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiToken)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.isError(), response ->
                        response.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Groq Error: " + body))
                )
                .bodyToMono(String.class)
                .block();
    }

    private String buildPrompt(String code,
                               String language,
                               String problemDescription) {
        return String.format("""
        You are a senior FANG engineer conducting a
        technical interview. Review the following %s code.
        
        Problem: %s
        
        Code:
        %s
        
        Provide structured feedback on:
        1. Time Complexity
        2. Space Complexity
        3. Variable Naming
        4. Edge Cases
        5. Code Readability
        6. Optimization Suggestions
        7. Overall Score (out of 10)
        
        IMPORTANT: At the end, you MUST write the score 
        in this exact format: **Overall Score: X/10**
        where X is a number from 1 to 10.
        
        Be strict but constructive like a real FANG interviewer.
        """, language, problemDescription, code);
    }
}

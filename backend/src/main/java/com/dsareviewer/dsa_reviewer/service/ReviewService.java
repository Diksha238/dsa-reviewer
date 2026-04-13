package com.dsareviewer.dsa_reviewer.service;


import com.dsareviewer.dsa_reviewer.dto.ReviewRequestDTO;
import com.dsareviewer.dsa_reviewer.dto.ReviewResponseDTO;

import com.dsareviewer.dsa_reviewer.model.Review;
import com.dsareviewer.dsa_reviewer.repository.ReviewRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final GroqService groqService;
    private final ReviewRepository reviewRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Cacheable(value = "reviews", key = "#request.code")
    public ReviewResponseDTO reviewCode(ReviewRequestDTO request) {

        String rawResponse = groqService.reviewCode(
                request.getCode(),
                request.getLanguage(),
                request.getProblemDescription()
        );

        String feedback = extractFeedback(rawResponse);

        Review review = new Review();
        review.setCode(request.getCode());
        review.setLanguage(request.getLanguage());
        review.setFeedback(feedback);
        review.setProblemDescription(request.getProblemDescription());
        review.setScore(extractScore(feedback));
        Review saved = reviewRepository.save(review);

        return mapToDTO(saved);
    }

    // ← NEW: Get all reviews
    public List<ReviewResponseDTO> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ← NEW: Get single review
    public ReviewResponseDTO getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Review not found with id: " + id));
        return mapToDTO(review);
    }

    // ← NEW: Map entity to DTO
    private ReviewResponseDTO mapToDTO(Review review) {
        ReviewResponseDTO response = new ReviewResponseDTO();
        response.setId(review.getId());
        response.setFeedback(review.getFeedback());
        response.setScore(review.getScore());
        response.setLanguage(review.getLanguage());
        response.setProblemDescription(review.getProblemDescription());
//        response.setCreatedAt(review.getCreatedAt());
        return response;
    }

    private String extractFeedback(String rawJson) {
        try {
            JsonNode root = objectMapper.readTree(rawJson);
            return root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();
        } catch (Exception e) {
            return rawJson;
        }
    }

    private Integer extractScore(String feedback) {
        try {
            // Pattern: "7/10" or "Score: 7" or "7 out of 10"
            java.util.regex.Pattern[] patterns = {
                    java.util.regex.Pattern.compile("\\*\\*Overall Score\\*\\*[^0-9]*([0-9]+)\\s*/\\s*10"),
                    java.util.regex.Pattern.compile("Overall Score[^0-9]*([0-9]+)\\s*/\\s*10"),
                    java.util.regex.Pattern.compile("([0-9]+)\\s*/\\s*10"),
                    java.util.regex.Pattern.compile("[Ss]core[^0-9]*([0-9]+)"),
            };

            for (java.util.regex.Pattern p : patterns) {
                java.util.regex.Matcher m = p.matcher(feedback);
                if (m.find()) {
                    int score = Integer.parseInt(m.group(1));
                    if (score >= 1 && score <= 10) return score;
                }
            }
        } catch (Exception e) {
            return 7;
        }
        return 7;
    }
}
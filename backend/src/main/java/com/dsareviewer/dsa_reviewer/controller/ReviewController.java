package com.dsareviewer.dsa_reviewer.controller;

import com.dsareviewer.dsa_reviewer.dto.ReviewRequestDTO;
import com.dsareviewer.dsa_reviewer.dto.ReviewResponseDTO;
import com.dsareviewer.dsa_reviewer.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> reviewCode(
            @Valid @RequestBody ReviewRequestDTO request) {
        return ResponseEntity.ok(
                reviewService.reviewCode(request));
    }

    // ← NEW
    @GetMapping("/history")
    public ResponseEntity<List<ReviewResponseDTO>> getHistory() {
        return ResponseEntity.ok(
                reviewService.getAllReviews());
    }

    // ← NEW
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> getById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                reviewService.getReviewById(id));
    }
}
package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.service.FeedbackService;
import com.pawguardian.springbackend.service.dto.ApiResponseDto;
import com.pawguardian.springbackend.service.dto.FeedbackRequestDto;
import com.pawguardian.springbackend.service.dto.FeedbackResponseDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/feedback")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<FeedbackResponseDto> submitFeedback(
            @Valid @RequestBody FeedbackRequestDto dto, Principal principal) {
        String email = principal != null ? principal.getName() : "anonymous";
        return new ResponseEntity<>(feedbackService.create(dto, email), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackResponseDto>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeedbackResponseDto> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.getById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto> deleteFeedback(@PathVariable Long id) {
        feedbackService.delete(id);
        return ResponseEntity.ok(ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Feedback deleted successfully")
                .build());
    }
}


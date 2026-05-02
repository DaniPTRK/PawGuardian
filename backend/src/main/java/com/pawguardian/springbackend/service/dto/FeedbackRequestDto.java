package com.pawguardian.springbackend.service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequestDto {

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    @NotBlank(message = "Recommendation answer is required")
    private String wouldRecommend;

    private Boolean mailAccuracyGood;

    private Boolean experienceFriendly;

    private Boolean vetSatisfied;

    @NotBlank(message = "Message is required")
    private String message;
}


package com.pawguardian.springbackend.service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponseDto {
    private Long id;
    private String userEmail;
    private String category;
    private Integer rating;
    private String wouldRecommend;
    private Boolean mailAccuracyGood;
    private Boolean experienceFriendly;
    private Boolean vetSatisfied;
    private String message;
    private LocalDateTime createdAt;
}


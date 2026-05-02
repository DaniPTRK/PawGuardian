package com.pawguardian.springbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks", schema = "project")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false, length = 20)
    private String wouldRecommend;

    @Builder.Default
    private Boolean mailAccuracyGood = false;

    @Builder.Default
    private Boolean experienceFriendly = false;

    @Builder.Default
    private Boolean vetSatisfied = false;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}


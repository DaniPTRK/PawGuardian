package com.pawguardian.springbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_metrics", schema="project")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double heartRate;    // heart rate
    private Double temperature;  // body temp

    // data for geofencing
    private Double latitude;
    private Double longitude;

    private LocalDateTime timestamp;

    // These metrics are associated to a single pet
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;
}
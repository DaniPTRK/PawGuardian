package com.pawguardian.springbackend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;

@Document(collection = "health_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthMetric {

    @Id
    private String id;

    @Indexed
    private Long petId;

    private Double heartRate;
    private Double temperature;
    private Integer batteryLevel;

    // GPS coordinates for geofencing
    private Double latitude;
    private Double longitude;

    @Indexed
    private Instant timestamp;   // Timestamp for tracking when the metric was recorded
}
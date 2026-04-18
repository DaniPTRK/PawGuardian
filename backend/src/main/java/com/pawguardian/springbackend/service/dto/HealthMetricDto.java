package com.pawguardian.springbackend.service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

// Used as both input (the device posts data) and output (frontend displaying info)
@Data
@Builder
public class HealthMetricDto {

    private Long id;

    @NotNull(message = "Pet ID is required")
    private Long petId;

    private Double latitude;
    private Double longitude;

    private Double heartRate;
    private Double temperature;

    // this value is given by the device
    @Min(value = 0, message = "Battery level must be between 0 and 100")
    @Max(value = 100, message = "Battery level must be between 0 and 100")
    private Integer batteryLevel;

    private LocalDateTime timestamp;
}
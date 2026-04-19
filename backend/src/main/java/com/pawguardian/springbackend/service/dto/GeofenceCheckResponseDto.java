package com.pawguardian.springbackend.service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeofenceCheckResponseDto {
    private Long petId;
    private String petName;
    private Double latitude;
    private Double longitude;
    private boolean insideSafeZone;
    private String safeZoneName;
    private String message;
}


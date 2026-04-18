package com.pawguardian.springbackend.service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeviceResponseDto {
    private Long id;
    private String serialNumber;
    private String model;
    private Integer batteryLevel;
    private Long petId;
    private String petName;
}


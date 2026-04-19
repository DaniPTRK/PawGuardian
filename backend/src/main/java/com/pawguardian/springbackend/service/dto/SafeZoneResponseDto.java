package com.pawguardian.springbackend.service.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SafeZoneResponseDto {
    private Long id;
    private String zoneName;
    private boolean active;
    private Long petId;
    private List<SafeZoneVertexDto> vertices;
}


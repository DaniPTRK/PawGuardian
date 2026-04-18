package com.pawguardian.springbackend.service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SafeZoneRequestDto {

    @NotBlank(message = "Zone name is required")
    private String zoneName;

    private Boolean active = true;

    @NotNull(message = "Vertices list is required")
    @Size(min = 3, message = "A safe zone must have at least 3 vertices")
    @Valid
    private List<SafeZoneVertexDto> vertices;
}


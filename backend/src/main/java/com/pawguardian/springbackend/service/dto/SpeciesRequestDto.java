package com.pawguardian.springbackend.service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SpeciesRequestDto {
    @NotBlank(message = "Species name is required")
    private String name;
}


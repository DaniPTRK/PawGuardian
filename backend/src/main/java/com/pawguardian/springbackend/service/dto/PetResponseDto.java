package com.pawguardian.springbackend.service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PetResponseDto {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private Integer age;
    private String ownerEmail;
}
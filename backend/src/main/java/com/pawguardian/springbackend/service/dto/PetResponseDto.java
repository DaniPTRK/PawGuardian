package com.pawguardian.springbackend.service.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class PetResponseDto {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private Integer age;
    private String ownerEmail;
    private Set<Long> assignedVetIds;
}
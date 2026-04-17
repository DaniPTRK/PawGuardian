package com.pawguardian.springbackend.service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PetRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Species is required (ex: dog, cat)")
    private String species;

    private String breed;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be a positive number")
    private Integer age;
}


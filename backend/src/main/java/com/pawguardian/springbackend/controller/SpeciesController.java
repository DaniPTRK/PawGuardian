package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.entity.PetSpecies;
import com.pawguardian.springbackend.service.SpeciesService;
import com.pawguardian.springbackend.service.dto.ApiResponseDto;
import com.pawguardian.springbackend.service.dto.SpeciesRequestDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/species")
@RequiredArgsConstructor
public class SpeciesController {

    private final SpeciesService speciesService;

    // TODO: use this in frontend, inside a dropdown
    @GetMapping
    public ResponseEntity<List<PetSpecies>> getAllSpecies() {
        return ResponseEntity.ok(speciesService.getAllSpecies());
    }

    // ADMIN operations - adding and deleting species
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<PetSpecies> addSpecies(@Valid @RequestBody SpeciesRequestDto dto) {
        return new ResponseEntity<>(speciesService.addSpecies(dto), HttpStatus.CREATED);
    }

    @DeleteMapping("/{speciesId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<ApiResponseDto> deleteSpecies(@PathVariable Integer speciesId) {
        speciesService.deleteSpecies(speciesId);
        return ResponseEntity.ok(ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Species deleted successfully")
                .build());
    }
}


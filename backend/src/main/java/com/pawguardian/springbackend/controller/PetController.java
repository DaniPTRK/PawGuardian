package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.service.PetService;
import com.pawguardian.springbackend.service.dto.ApiResponseDto;
import com.pawguardian.springbackend.service.dto.PetRequestDto;
import com.pawguardian.springbackend.service.dto.PetResponseDto;
import com.pawguardian.springbackend.service.dto.UserResponseDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/pets")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class PetController {

    private final PetService petService;

    // Add a new pet to the current user
    @PostMapping
    public ResponseEntity<PetResponseDto> addPet(@Valid @RequestBody PetRequestDto petRequest, Principal principal) {
        PetResponseDto savedPet = petService.addPet(petRequest, principal.getName());
        return new ResponseEntity<>(savedPet, HttpStatus.CREATED);
    }

    // Return all of user's pets
    @GetMapping("/my-pets")
    public ResponseEntity<List<PetResponseDto>> getMyPets(Principal principal) {
        return ResponseEntity.ok(petService.getMyPets(principal.getName()));
    }

    // Return pet corresponding to the ID
    @GetMapping("/{petId}")
    public ResponseEntity<PetResponseDto> getPetById(@PathVariable Long petId, Principal principal) {
        return ResponseEntity.ok(petService.getPetById(petId, principal.getName()));
    }

    // Update pet info using ID
    @PutMapping("/{petId}")
    public ResponseEntity<PetResponseDto> updatePet(@PathVariable Long petId, @Valid @RequestBody PetRequestDto petRequest, Principal principal) {
        return ResponseEntity.ok(petService.updatePet(petId, petRequest, principal.getName()));
    }

    // Delete pet using ID
    @DeleteMapping("/{petId}")
    public ResponseEntity<ApiResponseDto> deletePet(@PathVariable Long petId, Principal principal) {
        petService.deletePet(petId, principal.getName());
        ApiResponseDto response = ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Pet deleted successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    // Returns vets assigned to owner's pet
    @GetMapping("/{petId}/vets")
    public ResponseEntity<List<UserResponseDto>> getAssignedVets(@PathVariable Long petId, Principal principal) {
        return ResponseEntity.ok(petService.getAssignedVetsForPet(petId, principal.getName()));
    }
}
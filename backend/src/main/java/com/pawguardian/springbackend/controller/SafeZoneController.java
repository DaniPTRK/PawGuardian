package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.service.SafeZoneService;
import com.pawguardian.springbackend.service.dto.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/pets/{petId}/safe-zones")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
public class SafeZoneController {

    private final SafeZoneService safeZoneService;

    @PostMapping
    public ResponseEntity<SafeZoneResponseDto> createSafeZone(
            @PathVariable Long petId,
            @Valid @RequestBody SafeZoneRequestDto requestDto,
            Principal principal) {
        return new ResponseEntity<>(
                safeZoneService.createSafeZone(petId, requestDto, principal.getName()),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SafeZoneResponseDto>> getSafeZones(
            @PathVariable Long petId,
            Principal principal) {
        return ResponseEntity.ok(safeZoneService.getSafeZonesForPet(petId, principal.getName()));
    }

    @GetMapping("/{zoneId}")
    public ResponseEntity<SafeZoneResponseDto> getSafeZoneById(
            @PathVariable Long petId,
            @PathVariable Long zoneId,
            Principal principal) {
        return ResponseEntity.ok(safeZoneService.getSafeZoneById(petId, zoneId, principal.getName()));
    }

    @PutMapping("/{zoneId}")
    public ResponseEntity<SafeZoneResponseDto> updateSafeZone(
            @PathVariable Long petId,
            @PathVariable Long zoneId,
            @Valid @RequestBody SafeZoneRequestDto requestDto,
            Principal principal) {
        return ResponseEntity.ok(safeZoneService.updateSafeZone(petId, zoneId, requestDto, principal.getName()));
    }

    @DeleteMapping("/{zoneId}")
    public ResponseEntity<ApiResponseDto> deleteSafeZone(
            @PathVariable Long petId,
            @PathVariable Long zoneId,
            Principal principal) {
        safeZoneService.deleteSafeZone(petId, zoneId, principal.getName());
        return ResponseEntity.ok(ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Safe zone deleted successfully")
                .build());
    }

    // Check if a given coordinate is inside any active safe zone for this pet.
    // Trigger an email if the pet is not inside the safezone
    @PostMapping("/check")
    public ResponseEntity<GeofenceCheckResponseDto> checkGeofence(
            @PathVariable Long petId,
            @Valid @RequestBody GeofenceCheckRequestDto requestDto,
            Principal principal) {
        return ResponseEntity.ok(safeZoneService.checkGeofence(petId, requestDto, principal.getName()));
    }
}


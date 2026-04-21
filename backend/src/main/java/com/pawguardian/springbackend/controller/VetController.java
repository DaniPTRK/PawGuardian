package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.service.PetService;
import com.pawguardian.springbackend.service.SafeZoneService;
import com.pawguardian.springbackend.service.TelemetryService;
import com.pawguardian.springbackend.service.UserService;
import com.pawguardian.springbackend.service.dto.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vet")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('VET')")
public class VetController {

    private final UserService userService;
    private final PetService petService;
    private final SafeZoneService safeZoneService;
    private final TelemetryService telemetryService;

    // Patients data

    // List all pets assignated to the vet
    @GetMapping("/patients")
    public ResponseEntity<List<PetResponseDto>> getMyPatients(Principal principal) {
        return ResponseEntity.ok(userService.getAssignedPatients(principal.getName()));
    }

    // Get details about a pet
    @GetMapping("/patients/{petId}")
    public ResponseEntity<PetResponseDto> getPatientById(
            @PathVariable Long petId, Principal principal) {
        return ResponseEntity.ok(petService.getPetByIdForVet(petId, principal.getName()));
    }

    // Metrics

    // Latest sensor reading
    @GetMapping("/patients/{petId}/health/current")
    public ResponseEntity<HealthMetricDto> getCurrentStatus(
            @PathVariable Long petId, Principal principal) {
        return ResponseEntity.ok(telemetryService.getCurrentStatusAsVet(petId, principal.getName()));
    }

    // Full sensor history
    @GetMapping("/patients/{petId}/health/history")
    public ResponseEntity<List<HealthMetricDto>> getHealthHistory(
            @PathVariable Long petId, Principal principal) {
        return ResponseEntity.ok(telemetryService.getPetHistoryAsVet(petId, principal.getName()));
    }

    // Safe zone

    // List all safe zones for an assigned pet
    @GetMapping("/patients/{petId}/safe-zones")
    public ResponseEntity<List<SafeZoneResponseDto>> getSafeZones(
            @PathVariable Long petId, Principal principal) {
        return ResponseEntity.ok(safeZoneService.getSafeZonesForPetAsVet(petId, principal.getName()));
    }

    // Get a specific safe zone for an assigned pet
    @GetMapping("/patients/{petId}/safe-zones/{zoneId}")
    public ResponseEntity<SafeZoneResponseDto> getSafeZoneById(
            @PathVariable Long petId,
            @PathVariable Long zoneId,
            Principal principal) {
        return ResponseEntity.ok(safeZoneService.getSafeZoneByIdAsVet(petId, zoneId, principal.getName()));
    }
}


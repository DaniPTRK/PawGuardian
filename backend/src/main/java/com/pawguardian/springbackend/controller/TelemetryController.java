package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.service.TelemetryService;
import com.pawguardian.springbackend.service.dto.ApiResponseDto;
import com.pawguardian.springbackend.service.dto.HealthMetricDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/telemetry")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
public class TelemetryController {

    private final TelemetryService telemetryService;

    // No auth needed to post data through wearable device
    @PostMapping("/record")
    @SecurityRequirement(name = "none")
    public ResponseEntity<ApiResponseDto> recordTelemetry(@Valid @RequestBody HealthMetricDto metricDto) {
        telemetryService.recordTelemetry(metricDto);
        return new ResponseEntity<>(
                ApiResponseDto.builder()
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Telemetry data recorded successfully")
                        .build(),
                HttpStatus.CREATED);
    }

    // Frontend requests current location/status
    @GetMapping("/{petId}/current")
    public ResponseEntity<HealthMetricDto> getCurrentStatus(@PathVariable Long petId, Principal principal) {
        return ResponseEntity.ok(telemetryService.getCurrentStatus(petId, principal.getName()));
    }

    // Frontend requests full history for map display
    @GetMapping("/{petId}/history")
    public ResponseEntity<List<HealthMetricDto>> getHistory(@PathVariable Long petId, Principal principal) {
        return ResponseEntity.ok(telemetryService.getPetHistory(petId, principal.getName()));
    }
}
package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.service.DeviceService;
import com.pawguardian.springbackend.service.dto.ApiResponseDto;
import com.pawguardian.springbackend.service.dto.DeviceRequestDto;
import com.pawguardian.springbackend.service.dto.DeviceResponseDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class DeviceController {

    private final DeviceService deviceService;

    // TODO: owner clicks "Connect Device" in frontend when setting up a pet profile
    @PostMapping
    public ResponseEntity<DeviceResponseDto> registerDevice(
            @Valid @RequestBody DeviceRequestDto dto, Principal principal) {
        return new ResponseEntity<>(
                deviceService.registerDevice(dto, principal.getName()),
                HttpStatus.CREATED);
    }

    // get all devices associated to owner's pets
    @GetMapping("/my-devices")
    public ResponseEntity<List<DeviceResponseDto>> getMyDevices(Principal principal) {
        return ResponseEntity.ok(deviceService.getMyDevices(principal.getName()));
    }

    // get the device associated to a specific pet
    @GetMapping("/pet/{petId}")
    public ResponseEntity<DeviceResponseDto> getDeviceForPet(
            @PathVariable Long petId, Principal principal) {
        return ResponseEntity.ok(deviceService.getDeviceForPet(petId, principal.getName()));
    }

    // owner disconnects/removes a device from a pet
    @DeleteMapping("/pet/{petId}")
    public ResponseEntity<ApiResponseDto> removeDevice(
            @PathVariable Long petId, Principal principal) {
        deviceService.removeDevice(petId, principal.getName());
        return ResponseEntity.ok(ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Device removed successfully")
                .build());
    }
}


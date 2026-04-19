package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.service.UserService;
import com.pawguardian.springbackend.service.dto.ApiResponseDto;
import com.pawguardian.springbackend.service.dto.PetResponseDto;
import com.pawguardian.springbackend.service.dto.UpdateUserDto;
import com.pawguardian.springbackend.service.dto.UserResponseDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    // Own account endpoints

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyProfile(Principal principal) {
        return ResponseEntity.ok(userService.getProfile(principal.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateMyProfile(
            @Valid @RequestBody UpdateUserDto updateDto, Principal principal) {
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), updateDto));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponseDto> deleteMyAccount(Principal principal) {
        userService.deleteAccount(principal.getName());
        return ResponseEntity.ok(ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Account deleted successfully")
                .build());
    }

    // Vet endpoints

    @GetMapping("/vet/patients")
    @PreAuthorize("hasRole('VET')")
    public ResponseEntity<List<PetResponseDto>> getMyPatients(Principal principal) {
        return ResponseEntity.ok(userService.getAssignedPatients(principal.getName()));
    }

    // Admin-related endpoints
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> updateUserById(
            @PathVariable Long userId, @Valid @RequestBody UpdateUserDto updateDto) {
        return ResponseEntity.ok(userService.updateUserById(userId, updateDto));
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto> deleteUserById(@PathVariable Long userId) {
        userService.deleteUserById(userId);
        return ResponseEntity.ok(ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("User deleted successfully")
                .build());
    }

    @PostMapping("/{userId}/promote/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> promoteToRole(
            @PathVariable Long userId, @PathVariable String role) {
        return ResponseEntity.ok(userService.promoteToRole(userId, role));
    }

    @DeleteMapping("/{userId}/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> removeRole(
            @PathVariable Long userId, @PathVariable String role) {
        return ResponseEntity.ok(userService.removeRole(userId, role));
    }

    @PostMapping("/{vetId}/assign-pet/{petId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto> assignPetToVet(
            @PathVariable Long vetId, @PathVariable Long petId) {
        userService.assignPetToVet(vetId, petId);
        return ResponseEntity.ok(ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Pet assigned to vet successfully")
                .build());
    }

    @DeleteMapping("/{vetId}/assign-pet/{petId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto> removePetFromVet(
            @PathVariable Long vetId, @PathVariable Long petId) {
        userService.removePetFromVet(vetId, petId);
        return ResponseEntity.ok(ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Pet removed from vet successfully")
                .build());
    }
}

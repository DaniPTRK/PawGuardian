package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.entity.Role;
import com.pawguardian.springbackend.service.RoleService;
import com.pawguardian.springbackend.service.dto.ApiResponseDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto> addRoles(@RequestBody List<String> roleList) {
        List<String> added = roleService.addRoles(roleList);
        return new ResponseEntity<>(ApiResponseDto.builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Roles added: " + added)
                .build(), HttpStatus.CREATED);
    }

    @DeleteMapping("/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDto> deleteRole(@PathVariable String roleName) {
        roleService.deleteRole(roleName);
        return ResponseEntity.ok(ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Role '" + roleName + "' deleted successfully")
                .build());
    }
}

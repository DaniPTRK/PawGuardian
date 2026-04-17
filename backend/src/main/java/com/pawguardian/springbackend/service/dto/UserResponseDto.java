package com.pawguardian.springbackend.service.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private Set<String> roles;
}


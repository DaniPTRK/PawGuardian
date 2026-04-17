package com.pawguardian.springbackend.service.dto;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Getter
@Component
public class RegisterDto {

    private String email;
    private String username;
    private String password;

    public RegisterDto setEmail(String email) {
        this.email = email;
        return this;
    }

    public RegisterDto setUsername(String username) {
        this.username = username;
        return this;
    }

    public RegisterDto setPassword(String password) {
        this.password = password;
        return this;
    }
}

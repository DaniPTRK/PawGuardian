package com.pawguardian.springbackend.service.dto;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Getter
@Component
public class LoginDto {
    private String email;
    private String password;

    public LoginDto setEmail(String email) {
        this.email = email;
        return this;
    }

    public LoginDto setPassword(String password) {
        this.password = password;
        return this;
    }
}

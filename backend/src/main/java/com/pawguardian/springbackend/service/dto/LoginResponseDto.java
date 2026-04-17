package com.pawguardian.springbackend.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Getter
@Component
public class LoginResponseDto {

    @JsonProperty("access_token")
    private String token;
    @JsonProperty("token_type")
    private String type = "Bearer";
    @JsonProperty("expires_in")
    @Value("${token.ttl}")
    private long expire;

    public LoginResponseDto setToken(String token) {
        this.token = token;
        return this;
    }

    public LoginResponseDto setType(String type) {
        this.type = type;
        return this;
    }

    public LoginResponseDto setExpire(long expire) {
        this.expire = expire;
        return this;
    }
}

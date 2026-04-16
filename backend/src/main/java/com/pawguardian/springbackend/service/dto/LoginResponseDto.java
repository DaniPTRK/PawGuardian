package com.pawguardian.springbackend.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {

    @JsonProperty("access_token")
    private String token;

    @JsonProperty("token_type")
    @Builder.Default
    private String type = "Bearer";

    @JsonProperty("expires_in")
    private long expire;
}

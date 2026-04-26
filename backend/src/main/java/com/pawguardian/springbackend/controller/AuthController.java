package com.pawguardian.springbackend.controller;

import com.pawguardian.springbackend.service.AuthService;
import com.pawguardian.springbackend.service.dto.ApiResponseDto;
import com.pawguardian.springbackend.service.dto.LoginDto;
import com.pawguardian.springbackend.service.dto.LoginResponseDto;
import com.pawguardian.springbackend.service.dto.RegisterDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Value("${token.ttl}")
    private long tokenTtl;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @RequestMapping(path ="/register", method = RequestMethod.POST)
    public ResponseEntity<ApiResponseDto> register(@Valid @RequestBody RegisterDto registerDto) {
        logger.info("Request to register user {}", registerDto.getEmail());
        authService.register(registerDto);
        logger.info("Successfully registered user {}", registerDto.getEmail());

        ApiResponseDto response = ApiResponseDto.builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("User registered successfully")
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @RequestMapping(path ="/login", method = RequestMethod.POST)
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        logger.info("Request to login for user {}", loginDto.getEmail());
        String token = authService.login(loginDto);
        logger.info("Successfully logged in user {}", loginDto.getEmail());

        LoginResponseDto loginResponseDto = LoginResponseDto.builder()
                .token(token)
                .expire(tokenTtl)
                .build();

        return new ResponseEntity<>(loginResponseDto, HttpStatus.OK);
    }

    @SecurityRequirement(name = "BearerAuth")
    @RequestMapping(path ="/token", method = RequestMethod.GET)
    public ResponseEntity<ApiResponseDto> validateToken() {
        UserDetails user = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        logger.info("Request to validate token for user {}", user.getUsername());

        ApiResponseDto response = ApiResponseDto.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Token valid for user: " + user.getUsername())
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

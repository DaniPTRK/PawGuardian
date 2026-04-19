package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.config.security.JwtGenerator;
import com.pawguardian.springbackend.entity.Role;
import com.pawguardian.springbackend.entity.User;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.RoleRepository;
import com.pawguardian.springbackend.repository.UserRepository;
import com.pawguardian.springbackend.service.dto.LoginDto;
import com.pawguardian.springbackend.service.dto.RegisterDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;


import java.util.*;

@Service
@Transactional
@Slf4j
public class AuthService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtGenerator jwtGenerator;
    @Autowired
    private EmailService emailService;

    // Registering logic
    public void register(RegisterDto registerDto) throws BadRequestException {

        if(userRepository.existsUserByEmail(registerDto.getEmail())) {
            throw new BadRequestException("Email is already used");
        }

        Role ownerRole = roleRepository.findRoleByName("OWNER")
                .orElseThrow(() -> new BadRequestException("Default role not found in database"));

        // Save the new user with encoded pass
        User newUser = User.builder()
                .username(registerDto.getUsername())
                .email(registerDto.getEmail())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .roles(new HashSet<>(Collections.singletonList(ownerRole)))
                .build();

        userRepository.save(newUser);

        // Send welcome email asynchronously
        emailService.sendWelcomeEmail(newUser.getEmail(), newUser.getUsername());
    }

    // Login logic
    public String login(LoginDto loginDto) throws BadRequestException {
        Optional<User> optionalUser = userRepository.findUserByEmail(loginDto.getEmail());
        if(optionalUser.isEmpty()) {
            throw new BadRequestException("Wrong credentials");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtGenerator.generateToken(authentication);

    }
}

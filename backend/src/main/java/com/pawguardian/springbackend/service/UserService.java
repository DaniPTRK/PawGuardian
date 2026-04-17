package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.entity.User;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.UserRepository;
import com.pawguardian.springbackend.service.dto.UpdateUserDto;
import com.pawguardian.springbackend.service.dto.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponseDto getProfile(String email) {
        return mapToDto(findByEmail(email));
    }

    @Transactional
    public UserResponseDto updateProfile(String email, UpdateUserDto updateDto) {
        User user = findByEmail(email);

        if (updateDto.getUsername() != null && !updateDto.getUsername().isBlank()) {
            if (userRepository.existsUserByUsername(updateDto.getUsername())
                    && !user.getUsername().equals(updateDto.getUsername())) {
                throw new BadRequestException("Username is already taken");
            }
            user.setUsername(updateDto.getUsername());
        }

        if (updateDto.getNewPassword() != null && !updateDto.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updateDto.getNewPassword()));
        }

        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public void deleteAccount(String email) {
        User user = findByEmail(email);
        userRepository.delete(user);
    }

    // --- Admin operations ---

    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User with id " + userId + " not found"));
        return mapToDto(user);
    }

    @Transactional
    public UserResponseDto updateUserById(Long userId, UpdateUserDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User with id " + userId + " not found"));

        if (updateDto.getUsername() != null && !updateDto.getUsername().isBlank()) {
            if (userRepository.existsUserByUsername(updateDto.getUsername())
                    && !user.getUsername().equals(updateDto.getUsername())) {
                throw new BadRequestException("Username is already taken");
            }
            user.setUsername(updateDto.getUsername());
        }

        if (updateDto.getNewPassword() != null && !updateDto.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updateDto.getNewPassword()));
        }

        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User with id " + userId + " not found"));
        userRepository.delete(user);
    }

    // --- Helpers ---

    private User findByEmail(String email) {
        return userRepository.findUserByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found in system"));
    }

    private UserResponseDto mapToDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles().stream()
                        .map(r -> r.getName())
                        .collect(java.util.stream.Collectors.toSet()))
                .build();
    }
}



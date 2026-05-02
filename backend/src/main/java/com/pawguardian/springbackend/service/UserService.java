package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.entity.Pet;
import com.pawguardian.springbackend.entity.Role;
import com.pawguardian.springbackend.entity.User;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.PetRepository;
import com.pawguardian.springbackend.repository.RoleRepository;
import com.pawguardian.springbackend.repository.UserRepository;
import com.pawguardian.springbackend.service.dto.PetResponseDto;
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
    private final RoleRepository roleRepository;
    private final PetRepository petRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // Own account services

    @Transactional(readOnly = true)
    public UserResponseDto getProfile(String email) {
        return mapToDto(findByEmail(email));
    }

    @Transactional
    public UserResponseDto updateProfile(String email, UpdateUserDto updateDto) {
        User user = findByEmail(email);

        if (updateDto.getUsername() != null && !updateDto.getUsername().isBlank()) {
            if (userRepository.existsUserByUsername(updateDto.getUsername())
                    && !user.getDisplayUsername().equals(updateDto.getUsername())) {
                throw new BadRequestException("Username is already taken");
            }
            user.setDisplayUsername(updateDto.getUsername());
        }

        boolean passwordChanged = false;
        if (updateDto.getNewPassword() != null && !updateDto.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updateDto.getNewPassword()));
            passwordChanged = true;
        }

        UserResponseDto result = mapToDto(userRepository.save(user));
        if (passwordChanged) {
            emailService.sendPasswordChangedEmail(user.getEmail(), user.getDisplayUsername());
        }
        return result;
    }

    @Transactional
    public void deleteAccount(String email) {
        User user = findByEmail(email);
        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllVets() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName().equals("VET")))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Admin ops

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
                    && !user.getDisplayUsername().equals(updateDto.getUsername())) {
                throw new BadRequestException("Username is already taken");
            }
            user.setDisplayUsername(updateDto.getUsername());
        }

        boolean passwordChanged = false;
        if (updateDto.getNewPassword() != null && !updateDto.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updateDto.getNewPassword()));
            passwordChanged = true;
        }

        UserResponseDto result = mapToDto(userRepository.save(user));
        if (passwordChanged) {
            emailService.sendPasswordChangedByAdminEmail(user.getEmail(), user.getDisplayUsername());
        }
        return result;
    }

    @Transactional
    public void deleteUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User with id " + userId + " not found"));
        String savedEmail = user.getEmail();
        String savedUsername = user.getDisplayUsername();
        userRepository.delete(user);
        emailService.sendAccountDeletedByAdminEmail(savedEmail, savedUsername);
    }

    // Role promotion - service used by the admin
    @Transactional
    public UserResponseDto promoteToRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User with id " + userId + " not found"));

        String upperRole = roleName.toUpperCase();

        Role role = roleRepository.findRoleByName(upperRole)
                .orElseThrow(() -> new BadRequestException("Role '" + upperRole + "' not found"));

        if (user.getRoles().stream().anyMatch(r -> r.getName().equals(upperRole))) {
            throw new BadRequestException("User already has the role '" + upperRole + "'");
        }

        user.getRoles().add(role);
        UserResponseDto result = mapToDto(userRepository.save(user));

        // Send appropriate email based on role
        if (upperRole.equals("VET")) {
            emailService.sendPromotedToVetEmail(user.getEmail(), user.getDisplayUsername());
        } else if (upperRole.equals("ADMIN")) {
            emailService.sendPromotedToAdminEmail(user.getEmail(), user.getDisplayUsername());
        }

        return result;
    }

    // Role removal - service used by the admin
    @Transactional
    public UserResponseDto removeRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User with id " + userId + " not found"));

        String upperRole = roleName.toUpperCase();

        Role role = roleRepository.findRoleByName(upperRole)
                .orElseThrow(() -> new BadRequestException("Role '" + upperRole + "' not found"));

        if (user.getRoles().stream().noneMatch(r -> r.getName().equals(upperRole))) {
            throw new BadRequestException("User does not have the role '" + upperRole + "'");
        }

        if (user.getRoles().size() == 1) {
            throw new BadRequestException("Cannot remove the user's only role");
        }

        user.getRoles().remove(role);
        return mapToDto(userRepository.save(user));
    }

    // Admin assigns and removes pets from vet
    @Transactional
    public void assignPetToVet(Long vetId, Long petId) {
        User vet = getVetUser(vetId);
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new BadRequestException("Pet with id " + petId + " not found"));

        if (pet.getAssignedVets().contains(vet)) {
            throw new BadRequestException("Vet is already assigned to this pet");
        }
        pet.getAssignedVets().add(vet);
        petRepository.save(pet);
    }

    @Transactional
    public void removePetFromVet(Long vetId, Long petId) {
        User vet = getVetUser(vetId);
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new BadRequestException("Pet with id " + petId + " not found"));

        if (!pet.getAssignedVets().contains(vet)) {
            throw new BadRequestException("Vet is not assigned to this pet");
        }
        pet.getAssignedVets().remove(vet);
        petRepository.save(pet);
    }

    //

    @Transactional(readOnly = true)
    public List<PetResponseDto> getAssignedPatients(String vetEmail) {
        User vet = findByEmail(vetEmail);
        boolean isVet = vet.getRoles().stream().anyMatch(r -> r.getName().equals("VET"));
        if (!isVet) {
            throw new BadRequestException("User is not a VET");
        }
        return vet.getAssignedPets().stream()
                .map(this::mapPetToDto)
                .collect(Collectors.toList());
    }

    // --- Helpers ---

    private User getVetUser(Long vetId) {
        User user = userRepository.findById(vetId)
                .orElseThrow(() -> new BadRequestException("User with id " + vetId + " not found"));
        boolean isVet = user.getRoles().stream().anyMatch(r -> r.getName().equals("VET"));
        if (!isVet) {
            throw new BadRequestException("User with id " + vetId + " is not a VET");
        }
        return user;
    }

    private User findByEmail(String email) {
        return userRepository.findUserByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found in system"));
    }

    private UserResponseDto mapToDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getDisplayUsername())
                .email(user.getEmail())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .build();
    }

    private PetResponseDto mapPetToDto(Pet pet) {
        return PetResponseDto.builder()
                .id(pet.getId())
                .name(pet.getName())
                .breed(pet.getBreed())
                .age(pet.getAge())
                .ownerEmail(pet.getOwner().getEmail())
                .species(pet.getSpecies().getName())
                .assignedVetIds(pet.getAssignedVets().stream()
                        .map(u -> u.getId())
                        .collect(Collectors.toSet()))
                .build();
    }
}


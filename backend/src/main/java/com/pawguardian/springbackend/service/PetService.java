package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.entity.Pet;
import com.pawguardian.springbackend.entity.PetSpecies;
import com.pawguardian.springbackend.entity.User;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.PetRepository;
import com.pawguardian.springbackend.repository.PetSpeciesRepository;
import com.pawguardian.springbackend.repository.UserRepository;
import com.pawguardian.springbackend.service.dto.PetRequestDto;
import com.pawguardian.springbackend.service.dto.PetResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final PetSpeciesRepository petSpeciesRepository;

    @Transactional
    public PetResponseDto addPet(PetRequestDto requestDto, String ownerEmail) {
        User owner = findUserByEmail(ownerEmail);
        PetSpecies species = findSpeciesByName(requestDto.getSpecies());

        Pet pet = Pet.builder()
                .name(requestDto.getName())
                .species(species)
                .breed(requestDto.getBreed())
                .age(requestDto.getAge())
                .owner(owner)
                .build();

        return mapToDto(petRepository.save(pet));
    }

    @Transactional(readOnly = true)
    public List<PetResponseDto> getMyPets(String ownerEmail) {
        User owner = findUserByEmail(ownerEmail);
        return petRepository.findAllByOwnerId(owner.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PetResponseDto getPetById(Long petId, String ownerEmail) {
        return mapToDto(findPetOwnedBy(petId, ownerEmail));
    }

    @Transactional
    public PetResponseDto updatePet(Long petId, PetRequestDto requestDto, String ownerEmail) {
        Pet pet = findPetOwnedBy(petId, ownerEmail);

        if (requestDto.getName() != null && !requestDto.getName().isBlank()) {
            pet.setName(requestDto.getName());
        }
        if (requestDto.getSpecies() != null && !requestDto.getSpecies().isBlank()) {
            pet.setSpecies(findSpeciesByName(requestDto.getSpecies()));
        }
        if (requestDto.getBreed() != null) {
            pet.setBreed(requestDto.getBreed());
        }
        if (requestDto.getAge() != null) {
            pet.setAge(requestDto.getAge());
        }

        return mapToDto(petRepository.save(pet));
    }

    @Transactional
    public void deletePet(Long petId, String ownerEmail) {
        petRepository.delete(findPetOwnedBy(petId, ownerEmail));
    }

    // --- Helpers ---

    private User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found in system"));
    }

    private PetSpecies findSpeciesByName(String speciesName) {
        return petSpeciesRepository.findByNameIgnoreCase(speciesName)
                .orElseThrow(() -> new BadRequestException(
                        "Species '" + speciesName + "' not found. Available: dog, cat, bird, rabbit, other"));
    }

    private Pet findPetOwnedBy(Long petId, String ownerEmail) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new BadRequestException("Pet with id " + petId + " not found"));
        if (!pet.getOwner().getEmail().equals(ownerEmail)) {
            throw new BadRequestException("You do not have permission to access this pet");
        }
        return pet;
    }

    private PetResponseDto mapToDto(Pet pet) {
        return PetResponseDto.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies().getName())
                .breed(pet.getBreed())
                .age(pet.getAge())
                .ownerEmail(pet.getOwner().getEmail())
                .build();
    }
}
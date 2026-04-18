package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.entity.Pet;
import com.pawguardian.springbackend.entity.User;
import com.pawguardian.springbackend.entity.WearableDevice;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.PetRepository;
import com.pawguardian.springbackend.repository.UserRepository;
import com.pawguardian.springbackend.repository.WearableRepository;
import com.pawguardian.springbackend.service.dto.DeviceRequestDto;
import com.pawguardian.springbackend.service.dto.DeviceResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final WearableRepository wearableRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    @Transactional
    public DeviceResponseDto registerDevice(DeviceRequestDto dto, String ownerEmail) {
        User owner = findUserByEmail(ownerEmail);
        Pet pet = findPetOwnedBy(dto.getPetId(), owner);

        // Each pet can only have one device
        if (wearableRepository.findByPetId(pet.getId()).isPresent()) {
            throw new BadRequestException("Pet already has a device registered. Remove it first.");
        }

        // Serial number must be unique
        if (wearableRepository.findBySerialNumber(dto.getSerialNumber()).isPresent()) {
            throw new BadRequestException("A device with serial number '" + dto.getSerialNumber() + "' is already registered.");
        }

        WearableDevice device = WearableDevice.builder()
                .serialNumber(dto.getSerialNumber())
                .model(dto.getModel())
                .batteryLevel(100) // assume full battery
                .pet(pet)
                .build();

        return mapToDto(wearableRepository.save(device));
    }

    @Transactional(readOnly = true)
    public DeviceResponseDto getDeviceForPet(Long petId, String ownerEmail) {
        User owner = findUserByEmail(ownerEmail);
        findPetOwnedBy(petId, owner);

        return wearableRepository.findByPetId(petId)
                .map(this::mapToDto)
                .orElseThrow(() -> new BadRequestException("No device registered for pet with ID " + petId));
    }

    @Transactional(readOnly = true)
    public List<DeviceResponseDto> getMyDevices(String ownerEmail) {
        User owner = findUserByEmail(ownerEmail);
        return owner.getPets().stream()
                .flatMap(pet -> wearableRepository.findByPetId(pet.getId()).stream())
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeDevice(Long petId, String ownerEmail) {
        User owner = findUserByEmail(ownerEmail);
        findPetOwnedBy(petId, owner); // ownership check

        WearableDevice device = wearableRepository.findByPetId(petId)
                .orElseThrow(() -> new BadRequestException("No device found for pet with ID " + petId));

        wearableRepository.delete(device);
    }

    // helpers

    private User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }

    private Pet findPetOwnedBy(Long petId, User owner) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new BadRequestException("Pet with ID " + petId + " not found"));
        if (!pet.getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("You do not own this pet");
        }
        return pet;
    }

    private DeviceResponseDto mapToDto(WearableDevice device) {
        return DeviceResponseDto.builder()
                .id(device.getId())
                .serialNumber(device.getSerialNumber())
                .model(device.getModel())
                .batteryLevel(device.getBatteryLevel())
                .petId(device.getPet().getId())
                .petName(device.getPet().getName())
                .build();
    }
}


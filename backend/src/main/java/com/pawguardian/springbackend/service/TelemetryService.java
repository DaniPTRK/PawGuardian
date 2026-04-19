package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.entity.HealthMetric;
import com.pawguardian.springbackend.entity.Pet;
import com.pawguardian.springbackend.entity.User;
import com.pawguardian.springbackend.entity.WearableDevice;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.HealthMetricRepository;
import com.pawguardian.springbackend.repository.PetRepository;
import com.pawguardian.springbackend.repository.UserRepository;
import com.pawguardian.springbackend.repository.WearableRepository;
import com.pawguardian.springbackend.service.dto.HealthMetricDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TelemetryService {

    private final HealthMetricRepository healthMetricRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final WearableRepository wearableRepository;
    private final PetService petService;

    // Called by the wearable device to submit sensor readings
    @Transactional
    public void recordTelemetry(HealthMetricDto dto) {
        Pet pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() -> new BadRequestException("Pet with ID " + dto.getPetId() + " not found"));

        HealthMetric metric = HealthMetric.builder()
                .pet(pet)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .heartRate(dto.getHeartRate())
                .temperature(dto.getTemperature())
                .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now())
                .build();
        healthMetricRepository.save(metric);

        // Update battery level on the WearableDevice
        if (dto.getBatteryLevel() != null) {
            wearableRepository.findByPetId(pet.getId()).ifPresent(device -> {
                device.setBatteryLevel(dto.getBatteryLevel());
                wearableRepository.save(device);
            });
        }
    }

    // Returns the latest known metric & current battery level from device
    @Transactional(readOnly = true)
    public HealthMetricDto getCurrentStatus(Long petId, String ownerEmail) {
        verifyPetOwnership(petId, ownerEmail);

        HealthMetric latestMetric = healthMetricRepository.findTopByPetIdOrderByTimestampDesc(petId)
                .orElseThrow(() -> new BadRequestException("No telemetry data found for this pet yet"));

        Integer batteryLevel = wearableRepository.findByPetId(petId)
                .map(WearableDevice::getBatteryLevel)
                .orElse(null);

        return mapToDto(latestMetric, batteryLevel);
    }

    // Returns the full history of sensor readings for map display
    @Transactional(readOnly = true)
    public List<HealthMetricDto> getPetHistory(Long petId, String ownerEmail) {
        verifyPetOwnership(petId, ownerEmail);

        Integer batteryLevel = wearableRepository.findByPetId(petId)
                .map(WearableDevice::getBatteryLevel)
                .orElse(null);

        return healthMetricRepository.findAllByPetIdOrderByTimestampDesc(petId)
                .stream()
                .map(m -> mapToDto(m, batteryLevel))
                .collect(Collectors.toList());
    }

    // Vet access

    @Transactional(readOnly = true)
    public HealthMetricDto getCurrentStatusAsVet(Long petId, String vetEmail) {
        petService.findPetAssignedToVet(petId, vetEmail);

        HealthMetric latestMetric = healthMetricRepository.findTopByPetIdOrderByTimestampDesc(petId)
                .orElseThrow(() -> new BadRequestException("No telemetry data found for this pet yet"));

        Integer batteryLevel = wearableRepository.findByPetId(petId)
                .map(WearableDevice::getBatteryLevel)
                .orElse(null);

        return mapToDto(latestMetric, batteryLevel);
    }

    @Transactional(readOnly = true)
    public List<HealthMetricDto> getPetHistoryAsVet(Long petId, String vetEmail) {
        petService.findPetAssignedToVet(petId, vetEmail);

        Integer batteryLevel = wearableRepository.findByPetId(petId)
                .map(WearableDevice::getBatteryLevel)
                .orElse(null);

        return healthMetricRepository.findAllByPetIdOrderByTimestampDesc(petId)
                .stream()
                .map(m -> mapToDto(m, batteryLevel))
                .collect(Collectors.toList());
    }

    //h helpers
    private void verifyPetOwnership(Long petId, String ownerEmail) {
        User owner = userRepository.findUserByEmail(ownerEmail)
                .orElseThrow(() -> new BadRequestException("Invalid user"));

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new BadRequestException("Pet not found"));

        if (!pet.getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("You do not have permission to view this pet's data");
        }
    }

    private HealthMetricDto mapToDto(HealthMetric metric, Integer batteryLevel) {
        return HealthMetricDto.builder()
                .id(metric.getId())
                .petId(metric.getPet().getId())
                .latitude(metric.getLatitude())
                .longitude(metric.getLongitude())
                .heartRate(metric.getHeartRate())
                .temperature(metric.getTemperature())
                .batteryLevel(batteryLevel)
                .timestamp(metric.getTimestamp())
                .build();
    }
}
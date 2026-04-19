package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.entity.Pet;
import com.pawguardian.springbackend.entity.SafeZone;
import com.pawguardian.springbackend.entity.SafeZoneVertex;
import com.pawguardian.springbackend.entity.User;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.PetRepository;
import com.pawguardian.springbackend.repository.SafeZoneRepository;
import com.pawguardian.springbackend.repository.UserRepository;
import com.pawguardian.springbackend.service.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class SafeZoneService {

    private final SafeZoneRepository safeZoneRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${geofencing.alert-cooldown-minutes:5}")
    private long alertCooldownMinutes;

    // Tracks last alert times per pet to avoid spamming using geofence cooldown
    private final Map<Long, Instant> lastOutAlertTime = new ConcurrentHashMap<>();

    // Tracks last known status per pet
    private final Map<Long, Boolean> lastKnownStatus = new ConcurrentHashMap<>();

    // Create a safe zone given a list of vertices
    @Transactional
    public SafeZoneResponseDto createSafeZone(Long petId, SafeZoneRequestDto requestDto, String ownerEmail) {
        Pet pet = findPetOwnedBy(petId, ownerEmail);

        SafeZone zone = SafeZone.builder()
                .zoneName(requestDto.getZoneName())
                .isActive(requestDto.getActive() != null ? requestDto.getActive() : true)
                .pet(pet)
                .build();

        List<SafeZoneVertex> vertices = buildVertices(requestDto.getVertices(), zone);
        zone.setVertices(vertices);

        return mapToDto(safeZoneRepository.save(zone));
    }

    // Return the safe zones associated to a pet
    @Transactional(readOnly = true)
    public List<SafeZoneResponseDto> getSafeZonesForPet(Long petId, String ownerEmail) {
        findPetOwnedBy(petId, ownerEmail);
        return safeZoneRepository.findAllByPetId(petId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Return the safe zone associated to an ID
    @Transactional(readOnly = true)
    public SafeZoneResponseDto getSafeZoneById(Long petId, Long zoneId, String ownerEmail) {
        findPetOwnedBy(petId, ownerEmail);
        return mapToDto(findZoneForPet(zoneId, petId));
    }

    // Update the safezone data (vertices, name etc.)
    @Transactional
    public SafeZoneResponseDto updateSafeZone(Long petId, Long zoneId, SafeZoneRequestDto requestDto, String ownerEmail) {
        findPetOwnedBy(petId, ownerEmail);
        SafeZone zone = findZoneForPet(zoneId, petId);

        if (requestDto.getZoneName() != null && !requestDto.getZoneName().isBlank()) {
            zone.setZoneName(requestDto.getZoneName());
        }
        if (requestDto.getActive() != null) {
            zone.setActive(requestDto.getActive());
        }
        if (requestDto.getVertices() != null && !requestDto.getVertices().isEmpty()) {
            zone.getVertices().clear();
            zone.getVertices().addAll(buildVertices(requestDto.getVertices(), zone));
        }

        return mapToDto(safeZoneRepository.save(zone));
    }

    // Delete an existing safe zone
    @Transactional
    public void deleteSafeZone(Long petId, Long zoneId, String ownerEmail) {
        findPetOwnedBy(petId, ownerEmail);
        SafeZone zone = findZoneForPet(zoneId, petId);
        safeZoneRepository.delete(zone);
    }


    // Use ray casting algo to determine if the pet is in a safezone.
    // Trigger an email if the pet isn't inside the safezone
    @Transactional(readOnly = true)
    public GeofenceCheckResponseDto checkGeofence(Long petId, GeofenceCheckRequestDto request, String ownerEmail) {
        Pet pet = findPetOwnedBy(petId, ownerEmail);
        User owner = pet.getOwner();

        List<SafeZone> activeZones = safeZoneRepository.findAllByPetIdAndIsActive(petId, true);

        if (activeZones.isEmpty()) {
            return GeofenceCheckResponseDto.builder()
                    .petId(petId)
                    .petName(pet.getName())
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .insideSafeZone(false)
                    .message("No active safe zones defined for this pet.")
                    .build();
        }

        // Apply ray casting algo to determine if the pet is in any safezone
        SafeZone matchedZone = null;
        for (SafeZone zone : activeZones) {
            if (isInsideZone(request.getLatitude(), request.getLongitude(), zone)) {
                matchedZone = zone;
                break;
            }
        }

        boolean insideNow = matchedZone != null;
        Boolean wasInsideBefore = lastKnownStatus.get(petId);

        // Determine if status changed and send email
        if (wasInsideBefore == null || wasInsideBefore != insideNow) {
            if (!insideNow) {
                // Pet just left a zone
                String zoneName = activeZones.get(0).getZoneName();
                fireOutOfZoneAlert(owner, pet, zoneName,
                        request.getLatitude(), request.getLongitude());
            } else {
                // Pet came back
                String zoneName = matchedZone.getZoneName();
                emailService.sendPetBackInZoneAlert(
                        owner.getEmail(), owner.getUsername(), pet.getName(), zoneName);
            }
        }

        lastKnownStatus.put(petId, insideNow);

        String message = insideNow ?
                "Pet is inside safe zone: " + matchedZone.getZoneName()
                : "Pet is OUTSIDE all safe zones!";

        return GeofenceCheckResponseDto.builder()
                .petId(petId)
                .petName(pet.getName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .insideSafeZone(insideNow)
                .safeZoneName(insideNow ? matchedZone.getZoneName() : null)
                .message(message)
                .build();
    }

    // Use ray casting (even odd rule) to determine if a pet (lat, lon coords) is inside the safe zone
    private boolean isInsideZone(double lat, double lon, SafeZone zone) {
        List<SafeZoneVertex> vertices = zone.getVertices();
        int n = vertices.size();
        if (n < 3) return false;

        boolean inside = false;
        int j = n - 1;

        for (int i = 0; i < n; i++) {
            double xi = vertices.get(i).getLongitude();
            double yi = vertices.get(i).getLatitude();
            double xj = vertices.get(j).getLongitude();
            double yj = vertices.get(j).getLatitude();

            // Cast a ray from the point towards east
            boolean intersects = ((yi > lat) != (yj > lat))
                    && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);

            if (intersects) inside = !inside;
            j = i;
        }

        return inside;
    }

    // helpers

    // Send mail
    private void fireOutOfZoneAlert(User owner, Pet pet, String zoneName,
                                         double latitude, double longitude) {
        Instant now = Instant.now();
        Instant lastAlert = lastOutAlertTime.get(pet.getId());

        boolean cooldownExpired = lastAlert == null
                || now.isAfter(lastAlert.plusSeconds(alertCooldownMinutes * 60));

        if (cooldownExpired) {
            emailService.sendPetOutOfZoneAlert(
                    owner.getEmail(), owner.getUsername(), pet.getName(),
                    zoneName, latitude, longitude);
            lastOutAlertTime.put(pet.getId(), now);
        } else {
            log.debug("Out-of-zone alert for pet {} suppressed (cooldown active)", pet.getId());
        }
    }

    // used to check if the given pet ID is correct
    private Pet findPetOwnedBy(Long petId, String ownerEmail) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new BadRequestException("Pet with id " + petId + " not found"));
        if (!pet.getOwner().getEmail().equals(ownerEmail)) {
            throw new BadRequestException("You do not have permission to access this pet");
        }
        return pet;
    }

    // used to check if the given zone belongs to the pet
    private SafeZone findZoneForPet(Long zoneId, Long petId) {
        SafeZone zone = safeZoneRepository.findById(zoneId)
                .orElseThrow(() -> new BadRequestException("Safe zone with id " + zoneId + " not found"));
        if (!zone.getPet().getId().equals(petId)) {
            throw new BadRequestException("Safe zone does not belong to this pet");
        }
        return zone;
    }

    // Build vertices for a safezone given a list of vertex DTOs
    private List<SafeZoneVertex> buildVertices(List<SafeZoneVertexDto> dtos, SafeZone zone) {
        return IntStream.range(0, dtos.size())
                .mapToObj(i -> {
                    SafeZoneVertexDto dto = dtos.get(i);
                    return SafeZoneVertex.builder()
                            .latitude(dto.getLatitude())
                            .longitude(dto.getLongitude())
                            .sequenceOrder(i)
                            .safeZone(zone)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private SafeZoneResponseDto mapToDto(SafeZone zone) {
        List<SafeZoneVertexDto> vertexDtos = zone.getVertices().stream()
                .map(v -> SafeZoneVertexDto.builder()
                        .latitude(v.getLatitude())
                        .longitude(v.getLongitude())
                        .build())
                .collect(Collectors.toList());

        return SafeZoneResponseDto.builder()
                .id(zone.getId())
                .zoneName(zone.getZoneName())
                .active(zone.isActive())
                .petId(zone.getPet().getId())
                .vertices(vertexDtos)
                .build();
    }
}


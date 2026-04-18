package com.pawguardian.springbackend.repository;

import com.pawguardian.springbackend.entity.WearableDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WearableRepository extends JpaRepository<WearableDevice, Long> {
    Optional<WearableDevice> findByPetId(Long petId);
    Optional<WearableDevice> findBySerialNumber(String serialNumber);
}

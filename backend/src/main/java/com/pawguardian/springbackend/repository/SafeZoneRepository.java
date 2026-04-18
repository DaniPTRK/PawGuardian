package com.pawguardian.springbackend.repository;

import com.pawguardian.springbackend.entity.SafeZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SafeZoneRepository extends JpaRepository<SafeZone, Long> {
    // used to find all safe zones for a specific pet
    List<SafeZone> findAllByPetId(Long petId);

    // add filtering for active safezones
    List<SafeZone> findAllByPetIdAndIsActive(Long petId, boolean isActive);
}

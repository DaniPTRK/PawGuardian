package com.pawguardian.springbackend.repository;

import com.pawguardian.springbackend.entity.HealthMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {

    List<HealthMetric> findAllByPetIdOrderByTimestampDesc(Long petId);

    // This call is used to get the last timestamp (display purposes)
    Optional<HealthMetric> findTopByPetIdOrderByTimestampDesc(Long petId);
}
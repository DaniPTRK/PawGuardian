package com.pawguardian.springbackend.repository.mongodb;

import com.pawguardian.springbackend.entity.HealthMetric;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthMetricRepository extends MongoRepository<HealthMetric, String> {

    List<HealthMetric> findAllByPetIdOrderByTimestampDesc(Long petId);

    // This call is used to get the last timestamp (display purposes)
    Optional<HealthMetric> findTopByPetIdOrderByTimestampDesc(Long petId);
}


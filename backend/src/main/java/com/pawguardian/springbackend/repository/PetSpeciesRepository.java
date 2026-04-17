package com.pawguardian.springbackend.repository;

import com.pawguardian.springbackend.entity.PetSpecies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetSpeciesRepository extends JpaRepository<PetSpecies, Integer> {
    Optional<PetSpecies> findByNameIgnoreCase(String name);
}
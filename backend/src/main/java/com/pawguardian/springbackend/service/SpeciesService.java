package com.pawguardian.springbackend.service;

import com.pawguardian.springbackend.entity.PetSpecies;
import com.pawguardian.springbackend.exception.BadRequestException;
import com.pawguardian.springbackend.repository.PetSpeciesRepository;
import com.pawguardian.springbackend.service.dto.SpeciesRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpeciesService {

    private final PetSpeciesRepository petSpeciesRepository;

    @Transactional(readOnly = true)
    public List<PetSpecies> getAllSpecies() {
        return petSpeciesRepository.findAll();
    }

    @Transactional
    public PetSpecies addSpecies(SpeciesRequestDto dto) {
        if (petSpeciesRepository.findByNameIgnoreCase(dto.getName()).isPresent()) {
            throw new BadRequestException("Species '" + dto.getName() + "' already exists");
        }
        PetSpecies species = new PetSpecies();
        species.setName(dto.getName().toUpperCase());
        return petSpeciesRepository.save(species);
    }

    @Transactional
    public void deleteSpecies(Integer speciesId) {
        PetSpecies species = petSpeciesRepository.findById(speciesId)
                .orElseThrow(() -> new BadRequestException("Species with ID " + speciesId + " not found"));
        petSpeciesRepository.delete(species);
    }
}


package com.pawguardian.springbackend.entity;

// Possible species for a pet

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pet_species", schema = "project")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PetSpecies {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String name; // ex: "Cat", "Dog", "Other"
}

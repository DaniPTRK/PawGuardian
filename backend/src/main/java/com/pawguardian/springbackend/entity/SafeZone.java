package com.pawguardian.springbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "safe_zones", schema="project")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SafeZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String zoneName; // this is given by the user

    @Builder.Default
    private boolean isActive = true;

    // A pet could have one or more safe zones defined by the user
    // (normally, there should be only one safe zone)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    // A safezone is defined by a list of vertices
    @OneToMany(mappedBy = "safeZone", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceOrder ASC")
    @Builder.Default
    private List<SafeZoneVertex> vertices = new ArrayList<>();
}
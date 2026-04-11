package com.pawguardian.springbackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "safe_zone_vertices", schema="project")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SafeZoneVertex {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double latitude;
    private Double longitude;

    private Integer sequenceOrder;

    // A safezone has more of these vertices defined
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "safe_zone_id")
    private SafeZone safeZone;
}
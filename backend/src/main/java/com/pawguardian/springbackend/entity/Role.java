package com.pawguardian.springbackend.entity;

import jakarta.persistence.*;
import lombok.*;

// Role which is associated to a user
@Entity
@Table(name = "roles", schema = "project")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String name; // Ex: "ADMIN", "OWNER", "VET"
}
package com.pawguardian.springbackend.repository;

import com.pawguardian.springbackend.entity.User;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsUserByEmail(String email);
    Optional<User> findUserByEmail(String email);

    boolean existsUserByUsername(
            @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
            @Pattern(regexp = "^[a-zA-Z0-9_-]+$",
                    message = "Username can only contain letters, numbers, underscores and hyphens") String username);
}

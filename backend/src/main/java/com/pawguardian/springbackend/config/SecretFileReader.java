package com.pawguardian.springbackend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

// Reads Docker secrets from files and makes them available as env properties
// This allows Spring Boot to use Docker Swarm secrets
@Slf4j
public class SecretFileReader implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> secretProperties = new HashMap<>();

        // Read mail username from file if MAIL_USERNAME_FILE is set
        String mailUsernameFile = environment.getProperty("MAIL_USERNAME_FILE");
        if (mailUsernameFile != null && !mailUsernameFile.isEmpty()) {
            String mailUsername = readSecretFile(mailUsernameFile, "mail_username");
            if (mailUsername != null) {
                secretProperties.put("spring.mail.username", mailUsername);
                log.info("Loaded mail username from secret file");
            }
        }

        // Read mail password from file if MAIL_PASSWORD_FILE is set
        String mailPasswordFile = environment.getProperty("MAIL_PASSWORD_FILE");
        if (mailPasswordFile != null && !mailPasswordFile.isEmpty()) {
            String mailPassword = readSecretFile(mailPasswordFile, "mail_password");
            if (mailPassword != null) {
                secretProperties.put("spring.mail.password", mailPassword);
                log.info("Loaded mail password from secret file");
            }
        }

        // Add the secret properties to the environment
        if (!secretProperties.isEmpty()) {
            environment.getPropertySources().addFirst(
                new MapPropertySource("dockerSecrets", secretProperties)
            );
        }
    }

    // Reads a secret from a file path
    private String readSecretFile(String filePath, String secretName) {
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                String content = Files.readString(path).trim();
                log.info("Successfully read secret '{}' from {}", secretName, filePath);
                return content;
            } else {
                log.warn("Secret file '{}' not found at {}", secretName, filePath);
                return null;
            }
        } catch (IOException e) {
            log.error("Failed to read secret '{}' from {}: {}", secretName, filePath, e.getMessage());
            return null;
        }
    }
}


package com.pawguardian.springbackend.service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    @Value("${spring.mail.username:}")
    private String fromAddress;

    private String getFromAddress() {
        if (fromAddress == null || fromAddress.trim().isEmpty()) {
            return "noreply@pawguardian.com";
        }
        return fromAddress.trim();
    }

    // Sends a welcome email to new users when they register
    @Async
    public void sendWelcomeEmail(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(getFromAddress());
            message.setTo(toEmail);
            message.setSubject("Welcome to PawGuardian!");
            message.setText(
                "Hi " + username + ",\n\n" +
                "Welcome to PawGuardian! Your account has been successfully created.\n\n" +
                "You can now add your pets, configure safe zones, and monitor their health metrics.\n\n" +
                "Stay safe and happy pet tracking!\n\n" +
                "The PawGuardian Team"
            );
            mailSender.send(message);
            log.info("Welcome email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    // Send an email when the user changes his password
    @Async
    public void sendPasswordChangedEmail(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(getFromAddress());
            message.setTo(toEmail);
            message.setSubject("Your PawGuardian password has been changed");
            message.setText(
                "Hi " + username + ",\n\n" +
                "Your account password was just changed.\n\n" +
                "If you did this yourself, no action is needed.\n" +
                "If you did NOT make this change, please contact support immediately.\n\n" +
                "The PawGuardian Team"
            );
            mailSender.send(message);
            log.info("Password changed email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password changed email to {}: {}", toEmail, e.getMessage());
        }
    }

    // Send an email when an admin changes the user's password
    @Async
    public void sendPasswordChangedByAdminEmail(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(getFromAddress());
            message.setTo(toEmail);
            message.setSubject("Your PawGuardian password was reset by an administrator");
            message.setText(
                "Hi " + username + ",\n\n" +
                "An administrator has reset your account password.\n\n" +
                "Please log in with your new credentials and change your password as soon as possible.\n" +
                "If you did not request this change, please contact support immediately.\n\n" +
                "The PawGuardian Team"
            );
            mailSender.send(message);
            log.info("Admin password-reset email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send admin password-reset email to {}: {}", toEmail, e.getMessage());
        }
    }

    // Send an email when an admin deletes the user's account
    @Async
    public void sendAccountDeletedByAdminEmail(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(getFromAddress());
            message.setTo(toEmail);
            message.setSubject("Your PawGuardian account has been deleted");
            message.setText(
                "Hi " + username + ",\n\n" +
                "Your PawGuardian account has been deleted by an administrator.\n\n" +
                "If you believe this was a mistake, please contact support.\n\n" +
                "The PawGuardian Team"
            );
            mailSender.send(message);
            log.info("Account deleted by admin email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send account-deleted email to {}: {}", toEmail, e.getMessage());
        }
    }

    // Send an email when a user is promoted to VET by an admin
    @Async
    public void sendPromotedToVetEmail(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(getFromAddress());
            message.setTo(toEmail);
            message.setSubject("You have been promoted to Veterinarian on PawGuardian!");
            message.setText(
                "Hi " + username + ",\n\n" +
                "Congratulations! An administrator has verified your credentials and promoted your account to Veterinarian.\n\n" +
                "You now have access to the Vet platform, where you can view and manage the pets assigned to you.\n\n" +
                "Welcome aboard!\n\n" +
                "The PawGuardian Team"
            );
            mailSender.send(message);
            log.info("Promoted to VET email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send VET promotion email to {}: {}", toEmail, e.getMessage());
        }
    }

    // Sends an email when the user's pet leaves the safezone
    @Async
    public void sendPetOutOfZoneAlert(String toEmail, String ownerName, String petName, String zoneName,
                                      double latitude, double longitude) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(getFromAddress());
            message.setTo(toEmail);
            message.setSubject("ALERT: " + petName + " has left the safe zone!");
            message.setText(
                "Hi " + ownerName + ",\n\n" +
                "Your pet " + petName + " has left the safe zone \"" + zoneName + "\".\n\n" +
                "Last known location:\n" +
                "  Latitude:  " + latitude + "\n" +
                "  Longitude: " + longitude + "\n\n" +
                "Please check on your pet as soon as possible.\n\n" +
                "The PawGuardian Team"
            );
            mailSender.send(message);
            log.info("Out-of-zone alert sent to {} for pet {}", toEmail, petName);
        } catch (Exception e) {
            log.error("Failed to send out-of-zone alert to {}: {}", toEmail, e.getMessage());
        }
    }
    // Sends an email when the user's pet is back in the safezone
    @Async
    public void sendPetBackInZoneAlert(String toEmail, String ownerName, String petName, String zoneName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(getFromAddress());
            message.setTo(toEmail);
            message.setSubject("Good news! " + petName + " is back in the safe zone!");
            message.setText(
                "Hi " + ownerName + ",\n\n" +
                "Great news! Your pet " + petName + " is back inside the safe zone \"" + zoneName + "\".\n\n" +
                "Everything looks fine now.\n\n" +
                "The PawGuardian Team"
            );
            mailSender.send(message);
            log.info("Back-in-zone alert sent to {} for pet {}", toEmail, petName);
        } catch (Exception e) {
            log.error("Failed to send back-in-zone alert to {}: {}", toEmail, e.getMessage());
        }
    }
}

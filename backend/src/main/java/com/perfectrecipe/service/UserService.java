package com.perfectrecipe.service;

import com.perfectrecipe.model.User;
import com.perfectrecipe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Service
public class UserService {
    private final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final Path uploadDir;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService() {
        this.uploadDir = Paths.get("uploads", "profiles").toAbsolutePath();
        try {
            Files.createDirectories(uploadDir);
            logger.info("Profile upload directory created/verified at: {}", uploadDir);
        } catch (IOException e) {
            logger.error("Failed to create upload directory at {}: {}", uploadDir, e.getMessage());
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public User getUserProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserProfile(String email, Map<String, Object> updates) {
        User user = getUserProfile(email);
        
        if (updates.containsKey("displayName")) {
            user.setDisplayName((String) updates.get("displayName"));
        }
        if (updates.containsKey("fullName")) {
            user.setFullName((String) updates.get("fullName"));
        }
        if (updates.containsKey("phoneNumber")) {
            user.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("secondaryEmail")) {
            user.setSecondaryEmail((String) updates.get("secondaryEmail"));
        }
        if (updates.containsKey("country")) {
            user.setCountry((String) updates.get("country"));
        }
        if (updates.containsKey("state")) {
            user.setState((String) updates.get("state"));
        }
        if (updates.containsKey("zipCode")) {
            user.setZipCode((String) updates.get("zipCode"));
        }

        return userRepository.save(user);
    }

    public String updateProfileImage(String email, MultipartFile image) throws IOException {
        User user = getUserProfile(email);
        
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path filePath = uploadDir.resolve(fileName);
        
        try {
            // Save the file
            Files.copy(image.getInputStream(), filePath);
            
            // Update user's profile image URL
            String imageUrl = "/uploads/profiles/" + fileName;
            user.setProfileImageUrl(imageUrl);
            userRepository.save(user);
            
            logger.info("Successfully updated profile image for user: {}", email);
            return imageUrl;
        } catch (IOException e) {
            logger.error("Failed to save profile image for user {}: {}", email, e.getMessage());
            throw e;
        }
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = getUserProfile(email);
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User updateBillingAddress(String email, Map<String, Object> billingAddress) {
        User user = getUserProfile(email);
        user.setBillingAddress(billingAddress);
        return userRepository.save(user);
    }

    public User updateShippingAddress(String email, Map<String, Object> shippingAddress) {
        User user = getUserProfile(email);
        user.setShippingAddress(shippingAddress);
        return userRepository.save(user);
    }
} 
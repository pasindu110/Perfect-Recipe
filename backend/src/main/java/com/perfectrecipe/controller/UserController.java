package com.perfectrecipe.controller;

import com.perfectrecipe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        try {
            return ResponseEntity.ok(userService.getUserProfile(authentication.getName()));
        } catch (Exception e) {
            logger.error("Error fetching user profile: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user profile"));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(
            Authentication authentication,
            @RequestBody Map<String, Object> updates
    ) {
        try {
            return ResponseEntity.ok(userService.updateUserProfile(authentication.getName(), updates));
        } catch (Exception e) {
            logger.error("Error updating user profile: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update user profile"));
        }
    }

    @PostMapping("/profile/image")
    public ResponseEntity<?> updateProfileImage(
            Authentication authentication,
            @RequestParam("image") MultipartFile image
    ) {
        try {
            String imageUrl = userService.updateProfileImage(authentication.getName(), image);
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid image upload request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating profile image: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update profile image"));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody Map<String, String> passwords
    ) {
        try {
            userService.changePassword(
                authentication.getName(),
                passwords.get("currentPassword"),
                passwords.get("newPassword")
            );
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.error("Error changing password: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error changing password: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to change password"));
        }
    }

    @PutMapping("/billing-address")
    public ResponseEntity<?> updateBillingAddress(
            Authentication authentication,
            @RequestBody Map<String, Object> billingAddress
    ) {
        return ResponseEntity.ok(userService.updateBillingAddress(authentication.getName(), billingAddress));
    }

    @PutMapping("/shipping-address")
    public ResponseEntity<?> updateShippingAddress(
            Authentication authentication,
            @RequestBody Map<String, Object> shippingAddress
    ) {
        return ResponseEntity.ok(userService.updateShippingAddress(authentication.getName(), shippingAddress));
    }
}
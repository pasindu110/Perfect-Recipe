package com.perfectrecipe.controller;

import com.perfectrecipe.model.Notification;
import com.perfectrecipe.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.perfectrecipe.model.User;
import com.perfectrecipe.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getNotifications(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("Unauthenticated request to getNotifications");
                return ResponseEntity.status(403).body("User not authenticated");
            }

            String userEmail = authentication.getName();
            logger.info("Fetching notifications for user: {}", userEmail);
            
            User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

            List<Notification> notifications = notificationService.getUserNotifications(user.getId());
            logger.info("Found {} notifications for user: {}", notifications.size(), userEmail);
            
            return ResponseEntity.ok(Map.of("notifications", notifications));
        } catch (Exception e) {
            logger.error("Error fetching notifications", e);
            return ResponseEntity.status(500).body("Error fetching notifications: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable String id,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("Unauthenticated request to markAsRead");
                return ResponseEntity.status(403).body("User not authenticated");
            }

            String userEmail = authentication.getName();
            logger.info("Marking notification {} as read for user: {}", id, userEmail);
            
            User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

            Notification notification = notificationService.markAsRead(id, user.getId());
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            logger.error("Error marking notification as read", e);
            return ResponseEntity.status(500).body("Error marking notification as read: " + e.getMessage());
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("Unauthenticated request to markAllAsRead");
                return ResponseEntity.status(403).body("User not authenticated");
            }

            String userEmail = authentication.getName();
            logger.info("Marking all notifications as read for user: {}", userEmail);
            
            User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

            notificationService.markAllAsRead(user.getId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error marking all notifications as read", e);
            return ResponseEntity.status(500).body("Error marking all notifications as read: " + e.getMessage());
        }
    }
} 
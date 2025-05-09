package com.perfectrecipe.repository;

import com.perfectrecipe.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);
    List<Notification> findByRecipientIdAndReadFalse(String recipientId);
    void deleteByRecipientId(String recipientId);
} 
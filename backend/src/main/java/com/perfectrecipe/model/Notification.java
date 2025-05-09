package com.perfectrecipe.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    
    private String recipientId;
    private String senderId;
    private String type; // like, comment, follow
    private String message;
    private String link;
    private boolean read;
    private LocalDateTime createdAt;
    
    @DBRef
    private User sender;

    public Notification() {
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }
} 
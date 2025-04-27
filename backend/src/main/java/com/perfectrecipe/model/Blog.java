package com.perfectrecipe.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "blogs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Blog {
    @Id
    private String id;

    private String title;
    private String content;
    private String imageUrl;

    @DBRef
    private User user;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 
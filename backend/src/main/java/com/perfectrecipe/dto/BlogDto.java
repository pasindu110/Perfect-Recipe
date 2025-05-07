package com.perfectrecipe.dto;

import lombok.Data;

@Data
public class BlogDto {
    private String id;
    private String title;
    private String content;
    private String imageUrl;
    private String createdAt;
    private String updatedAt;
    private String userId;
    private String userName;
} 
package com.perfectrecipe.dto;

import com.perfectrecipe.model.Blog;

public class BlogMapper {
    public static BlogDto toDto(Blog blog) {
        BlogDto dto = new BlogDto();
        dto.setId(blog.getId());
        dto.setTitle(blog.getTitle());
        dto.setContent(blog.getContent());
        dto.setImageUrl(blog.getImageUrl());
        dto.setCreatedAt(blog.getCreatedAt() != null ? blog.getCreatedAt().toString() : null);
        dto.setUpdatedAt(blog.getUpdatedAt() != null ? blog.getUpdatedAt().toString() : null);
        if (blog.getUser() != null) {
            dto.setUserId(blog.getUser().getId());
            dto.setUserName(blog.getUser().getFullName());
        }
        return dto;
    }
} 
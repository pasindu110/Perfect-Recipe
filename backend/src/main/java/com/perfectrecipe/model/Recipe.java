package com.perfectrecipe.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.util.List;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "recipes")
public class Recipe {
    @Id
    private String id;
    private String title;
    private String description;
    private String image;
    private List<String> ingredients = new ArrayList<>();
    private List<String> instructions = new ArrayList<>();
    private String userId;
    private String authorId;
    private int prepTime;
    private int cookTime;
    private int servings;
    private String cuisine;
    private List<String> categories;
    private List<String> likes = new ArrayList<>();
    private List<String> likedByUsers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private NutritionFacts nutritionFacts;
    private String videoUrl;
    private List<Comment> comments = new ArrayList<>();

    @DBRef
    private User author;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutritionFacts {
        private String calories;
        private String protein;
        private String carbs;
        private String fat;
    }

    @Data
    public static class Comment {
        private String id;
        private String authorId;
        private String content;
        private LocalDateTime createdAt;
        
        @DBRef
        private User author;
    }
}
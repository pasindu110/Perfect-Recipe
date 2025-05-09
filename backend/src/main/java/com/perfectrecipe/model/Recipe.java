package com.perfectrecipe.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

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
    private List<String> ingredients;
    private List<String> instructions;
    private String userId;
    private String author;
    private int prepTime;
    private int cookTime;
    private int servings;
    private String cuisine;
    private List<String> categories;
    private Integer likes;
    private List<String> likedByUsers;
    private String createdAt;
    private String updatedAt;
    private NutritionFacts nutritionFacts;
    private String videoUrl;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutritionFacts {
        private String calories;
        private String protein;
        private String carbs;
        private String fat;
    }
}
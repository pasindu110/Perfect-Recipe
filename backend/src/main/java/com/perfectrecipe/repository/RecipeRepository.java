package com.perfectrecipe.repository;

import com.perfectrecipe.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RecipeRepository extends MongoRepository<Recipe, String> {
    List<Recipe> findByUserId(String userId);
    List<Recipe> findByCuisine(String cuisine);
    List<Recipe> findByTitleContainingIgnoreCase(String title);
    List<Recipe> findTop10ByOrderByLikesDesc();
} 
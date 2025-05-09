package com.perfectrecipe.service;

import com.perfectrecipe.model.Recipe;
import com.perfectrecipe.model.User;
import com.perfectrecipe.repository.RecipeRepository;
import com.perfectrecipe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;

import lombok.Data;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // ... existing methods ...

    public Recipe getRecipeById(String id) {
        return recipeRepository.findById(id).orElse(null);
    }

    public Recipe.Comment addComment(String recipeId, String userId, String content) {
        Recipe recipe = getRecipeById(recipeId);
        if (recipe == null) {
            throw new RuntimeException("Recipe not found");
        }

        Recipe.Comment comment = new Recipe.Comment();
        comment.setId(new ObjectId().toString());
        comment.setAuthorId(userId);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());

        recipe.getComments().add(comment);
        recipeRepository.save(recipe);
        return comment;
    }

    public Recipe deleteComment(String recipeId, String commentId, String userId) {
        Recipe recipe = recipeRepository.findById(recipeId)
            .orElseThrow(() -> new RuntimeException("Recipe not found"));

        Optional<Recipe.Comment> commentToDelete = recipe.getComments().stream()
            .filter(comment -> comment.getId().equals(commentId))
            .findFirst();

        if (commentToDelete.isEmpty()) {
            throw new RuntimeException("Comment not found");
        }

        Recipe.Comment comment = commentToDelete.get();
        if (!comment.getAuthorId().equals(userId) && !recipe.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        recipe.getComments().removeIf(c -> c.getId().equals(commentId));
        return recipeRepository.save(recipe);
    }
} 
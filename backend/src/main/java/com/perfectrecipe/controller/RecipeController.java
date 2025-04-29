package com.perfectrecipe.controller;

import com.perfectrecipe.model.Recipe;
import com.perfectrecipe.model.Comment;
import com.perfectrecipe.repository.RecipeRepository;
import com.perfectrecipe.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import java.util.List;
import java.util.Base64;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.security.core.Authentication;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    @GetMapping("/trending")
    public List<Recipe> getTrendingRecipes() {
        return recipeRepository.findTop10ByOrderByLikesDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable String id) {
        return recipeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createRecipe(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("prepTime") int prepTime,
            @RequestParam("cookTime") int cookTime,
            @RequestParam("servings") int servings,
            @RequestParam("cuisine") String cuisine,
            @RequestParam("ingredients") String ingredients,
            @RequestParam("instructions") String instructions,
            @RequestParam("nutritionFacts") String nutritionFacts,
            @RequestParam("userId") String userId,
            @RequestParam("author") String author,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            System.out.println("Received recipe creation request");
            Recipe recipe = new Recipe();
            recipe.setTitle(title);
            recipe.setDescription(description);
            recipe.setPrepTime(prepTime);
            recipe.setCookTime(cookTime);
            recipe.setServings(servings);
            recipe.setCuisine(cuisine);
            recipe.setUserId(userId);
            recipe.setAuthor(author);
            
            // Parse JSON arrays
            recipe.setIngredients(objectMapper.readValue(ingredients, new TypeReference<List<String>>() {}));
            recipe.setInstructions(objectMapper.readValue(instructions, new TypeReference<List<String>>() {}));
            
            // Parse nutrition facts
            Recipe.NutritionFacts nutrition = objectMapper.readValue(nutritionFacts, Recipe.NutritionFacts.class);
            recipe.setNutritionFacts(nutrition);
            
            if (image != null && !image.isEmpty()) {
                System.out.println("Processing image upload");
                String contentType = image.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Invalid file type. Only images are allowed.");
                }
                String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
                recipe.setImage(base64Image);
            } else {
                recipe.setImage(null);
            }
            
            recipe.setCreatedAt(java.time.LocalDateTime.now().toString());
            recipe.setUpdatedAt(java.time.LocalDateTime.now().toString());
            Recipe savedRecipe = recipeRepository.save(recipe);
            System.out.println("Recipe saved successfully");
            return ResponseEntity.ok(savedRecipe);
        } catch (Exception e) {
            System.err.println("Error processing recipe: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Error processing recipe: " + e.getMessage());
        }
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<?> handleMissingParts(MissingServletRequestPartException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body("Missing required request part: " + ex.getRequestPartName());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable String id, @RequestBody Recipe recipeDetails) {
        return recipeRepository.findById(id)
                .map(recipe -> {
                    recipe.setTitle(recipeDetails.getTitle());
                    recipe.setDescription(recipeDetails.getDescription());
                    recipe.setImage(recipeDetails.getImage());
                    recipe.setIngredients(recipeDetails.getIngredients());
                    recipe.setInstructions(recipeDetails.getInstructions());
                    recipe.setPrepTime(recipeDetails.getPrepTime());
                    recipe.setCookTime(recipeDetails.getCookTime());
                    recipe.setServings(recipeDetails.getServings());
                    recipe.setCuisine(recipeDetails.getCuisine());
                    recipe.setCategories(recipeDetails.getCategories());
                    recipe.setUpdatedAt(java.time.LocalDateTime.now().toString());
                    return ResponseEntity.ok(recipeRepository.save(recipe));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable String id) {
        return recipeRepository.findById(id)
                .map(recipe -> {
                    recipeRepository.delete(recipe);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Recipe> searchRecipes(@RequestParam String query) {
        return recipeRepository.findByTitleContainingIgnoreCase(query);
    }

    @GetMapping("/cuisine/{cuisine}")
    public List<Recipe> getRecipesByCuisine(@PathVariable String cuisine) {
        return recipeRepository.findByCuisine(cuisine);
    }

    @GetMapping("/user/{userId}")
    public List<Recipe> getRecipesByUser(@PathVariable String userId) {
        return recipeRepository.findByUserId(userId);
    }

    @GetMapping("/{recipeId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String recipeId) {
        try {
            List<Comment> comments = commentRepository.findByRecipeIdOrderByCreatedAtDesc(recipeId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{recipeId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable String recipeId,
            @RequestParam("userId") String userId,
            @RequestParam("authorName") String authorName,
            @RequestParam("content") String content,
            @RequestParam("rating") int rating) {
        try {
            Comment comment = new Comment();
            comment.setRecipeId(recipeId);
            comment.setUserId(userId);
            comment.setAuthorName(authorName);
            comment.setContent(content);
            comment.setRating(rating);
            comment.setCreatedAt(java.time.LocalDateTime.now().toString());
            
            Comment savedComment = commentRepository.save(comment);
            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeRecipe(@PathVariable String id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User must be authenticated to like recipes");
        }

        String userId = authentication.getName();
        return recipeRepository.findById(id)
                .map(recipe -> {
                    // Initialize likedByUsers if null
                    if (recipe.getLikedByUsers() == null) {
                        recipe.setLikedByUsers(new ArrayList<>());
                    }
                    
                    // Toggle like
                    if (recipe.getLikedByUsers().contains(userId)) {
                        // Remove like
                        recipe.getLikedByUsers().remove(userId);
                        recipe.setLikes(recipe.getLikes() == null ? 0 : recipe.getLikes() - 1);
                    } else {
                        // Add like
                        recipe.getLikedByUsers().add(userId);
                        recipe.setLikes(recipe.getLikes() == null ? 1 : recipe.getLikes() + 1);
                    }
                    
                    Recipe updatedRecipe = recipeRepository.save(recipe);
                    return ResponseEntity.ok(updatedRecipe);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
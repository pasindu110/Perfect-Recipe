package com.perfectrecipe.repository;

import com.perfectrecipe.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByRecipeIdOrderByCreatedAtDesc(String recipeId);
}
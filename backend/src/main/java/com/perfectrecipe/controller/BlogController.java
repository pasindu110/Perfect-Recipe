package com.perfectrecipe.controller;

import com.perfectrecipe.model.Blog;
import com.perfectrecipe.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {
    private final BlogService blogService;
    private final Logger logger = LoggerFactory.getLogger(BlogController.class);

    @Autowired
    public BlogController(BlogService blogService) {
        this.blogService = blogService;
        logger.info("BlogController initialized");
    }

    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs() {
        try {
            logger.info("Fetching all blogs");
            List<Blog> blogs = blogService.getAllBlogs();
            logger.info("Found {} blogs", blogs.size());
            return ResponseEntity.ok(blogs);
        } catch (Exception e) {
            logger.error("Error fetching all blogs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable String id) {
        logger.info("Received request to fetch blog with id: {}", id);
        
        if (id == null || id.trim().isEmpty()) {
            logger.warn("Invalid blog ID provided: {}", id);
            return ResponseEntity.badRequest().build();
        }

        try {
            return blogService.getBlogById(id)
                    .map(blog -> {
                        logger.info("Successfully found blog: {}", blog);
                        return ResponseEntity.ok(blog);
                    })
                    .orElseGet(() -> {
                        logger.warn("No blog found with id: {}", id);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .build();
                    });
        } catch (Exception e) {
            logger.error("Error fetching blog: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBlog(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            Blog blog = new Blog();
            blog.setTitle(title);
            blog.setContent(content);
            
            if (image != null && !image.isEmpty()) {
                String imageUrl = blogService.saveImage(image);
                blog.setImageUrl(imageUrl);
            }
            
            Blog savedBlog = blogService.createBlog(blog);
            logger.info("Successfully created blog with id: {}", savedBlog.getId());
            return ResponseEntity.ok(savedBlog);
        } catch (Exception e) {
            logger.error("Error creating blog: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create blog: " + e.getMessage()));
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBlog(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            Blog updatedBlog = blogService.updateBlog(id, title, content, image, null);
            logger.info("Successfully updated blog with id: {}", updatedBlog.getId());
            return ResponseEntity.ok(updatedBlog);
        } catch (Exception e) {
            logger.error("Error updating blog: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update blog: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable String id) {
        try {
            blogService.deleteBlog(id, null);
            logger.info("Successfully deleted blog with id: {}", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting blog: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete blog: " + e.getMessage()));
        }
    }
}
package com.perfectrecipe.service;

import com.perfectrecipe.model.Blog;
import com.perfectrecipe.model.User;
import com.perfectrecipe.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BlogService {

    private final BlogRepository blogRepository;
    private final Logger logger = LoggerFactory.getLogger(BlogService.class);

    @Value("${upload.path:uploads/blogs}")
    private String uploadPath;

    @Autowired
    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public List<Blog> getAllBlogs() {
        return blogRepository.findAll();
    }

    public Optional<Blog> getBlogById(String id) {
        return blogRepository.findById(id);
    }

    public Blog createBlog(Blog blog) {
        blog.setCreatedAt(LocalDateTime.parse(LocalDateTime.now().toString()));
        blog.setUpdatedAt(LocalDateTime.parse(LocalDateTime.now().toString()));
        return blogRepository.save(blog);
    }

    public Blog updateBlog(String id, String title, String content, MultipartFile image, User user) throws IOException {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Blog not found"));

        blog.setTitle(title);
        blog.setContent(content);
        blog.setUpdatedAt(LocalDateTime.parse(LocalDateTime.now().toString()));

        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image);
            blog.setImageUrl(imageUrl);
        }

        return blogRepository.save(blog);
    }

    public void deleteBlog(String id, User user) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Blog not found"));
        blogRepository.delete(blog);
    }

    public String saveImage(MultipartFile image) throws IOException {
        if (image.isEmpty()) {
            throw new IllegalArgumentException("Image file is empty");
        }

        // Create uploads directory if it doesn't exist
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generate unique filename
        String originalFilename = image.getOriginalFilename();
        String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String newFilename = UUID.randomUUID().toString() + "_" + (originalFilename != null ? originalFilename : "image" + fileExtension);

        // Save file
        Path filePath = Paths.get(uploadPath, newFilename);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return the relative path that can be used in URLs
        return uploadPath + "/" + newFilename;
    }
}
package com.perfectrecipe.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "challenges")
public class Challenge {

    @Id
    private String id;

    private String userId;
    private String recipeVideoUrl;
    private String startDate; // format: yyyy-MM-dd
    private String startTime; // format: HH:mm
    private String endTime;   // format: HH:mm
    private String status; // "Pending", "Ongoing", "Completed"
    private List<String> uploadedImages;

    // Constructors
    public Challenge() {}

    public Challenge(String id, String userId, String recipeVideoUrl, String startDate,
                     String startTime, String endTime, String status, List<String> uploadedImages) {
        this.id = id;
        this.userId = userId;
        this.recipeVideoUrl = recipeVideoUrl;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.uploadedImages = uploadedImages;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getRecipeVideoUrl() {
        return recipeVideoUrl;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public String getStatus() {
        return status;
    }

    public List<String> getUploadedImages() {
        return uploadedImages;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setRecipeVideoUrl(String recipeVideoUrl) {
        this.recipeVideoUrl = recipeVideoUrl;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setUploadedImages(List<String> uploadedImages) {
        this.uploadedImages = uploadedImages;
    }
}

package com.perfectrecipe.controller;

import com.perfectrecipe.model.Challenge;
import com.perfectrecipe.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin("*")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    // Get all challenges for a user
    @GetMapping("/{userId}")
    public List<Challenge> getUserChallenges(@PathVariable String userId) {
        return challengeService.getChallengesByUser(userId);
    }

    // Get all challenges
    @GetMapping("/{id}/all")
    public Challenge getChallengeById(@PathVariable String id) {
        return challengeService.getChallengeById(id).orElse(null);
    }

    // Create a new challenge
    @PostMapping
    public Challenge createChallenge(@RequestBody Challenge challenge) {
        return challengeService.createChallenge(challenge);
    }

    // Edit/update an existing challenge
    @PutMapping("/{id}")
    public Challenge updateChallenge(@PathVariable String id, @RequestBody Challenge updatedChallenge) {
        return challengeService.updateChallenge(id, updatedChallenge);
    }

    // Delete a challenge
    @DeleteMapping("/{id}")
    public void deleteChallenge(@PathVariable String id) {
        challengeService.deleteChallenge(id);
    }

    // Start a challenge
    @PutMapping("/{id}/start")
    public Challenge startChallenge(@PathVariable String id) {
        return challengeService.startChallenge(id);
    }

    // Restart a challenge
    @PutMapping("/{id}/restart")
    public Challenge restartChallenge(@PathVariable String id) {
        return challengeService.restartChallenge(id);
    }

    // Pause a challenge
    // @PutMapping("/{id}/pause")
    // public Challenge pauseChallenge(@PathVariable String id) {
    //     return challengeService.pauseChallenge(id);
    // }

    @PutMapping("/{id}/pause")
public ResponseEntity<?> pauseChallenge(@PathVariable String id) {
    try {
        Challenge updated = challengeService.pauseChallenge(id);
        return ResponseEntity.ok(updated);
    } catch (Exception e) {
        e.printStackTrace(); // You’ll see this in terminal
        return ResponseEntity.status(500).body("Error pausing challenge: " + e.getMessage());
    }
}

    

    // Finish a challenge (with uploaded images)
    @PutMapping("/{id}/finish")
    public Challenge finishChallenge(@PathVariable String id, @RequestBody List<String> images) {
        return challengeService.finishChallenge(id, images);
    }

//     @GetMapping("/{id}/isExpired")
// public boolean isChallengeExpired(@PathVariable String id) {
//     Challenge challenge = challengeService.getChallengeById(id);
//     return challengeService.isExpired(challenge);
// }
}


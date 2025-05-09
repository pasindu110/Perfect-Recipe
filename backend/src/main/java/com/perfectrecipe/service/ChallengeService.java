package com.perfectrecipe.service;


import com.perfectrecipe.model.Challenge;
import com.perfectrecipe.repository.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    public List<Challenge> getChallengesByUser(String userId) {
        return challengeRepository.findByUserId(userId);
    }

    public Challenge createChallenge(Challenge challenge) {
        challenge.setStatus("Pending");
        return challengeRepository.save(challenge);
    }

    public void deleteChallenge(String id) {
        challengeRepository.deleteById(id);
    }

    public Optional<Challenge> getChallengeById(String id) {
        return challengeRepository.findById(id);
    }

    public Challenge startChallenge(String id) {
        Challenge challenge = getChallengeById(id).orElseThrow();
        if (!isExpired(challenge)) {
            challenge.setStatus("Ongoing");
            return challengeRepository.save(challenge);
        }
        throw new IllegalStateException("Cannot start expired challenge");
    }

    public Challenge restartChallenge(String id) {
        Challenge challenge = getChallengeById(id).orElseThrow();
        if (!isExpired(challenge)) {
            challenge.setStatus("Pending");
            return challengeRepository.save(challenge);
        }
        throw new IllegalStateException("Cannot restart expired challenge");
    }

    public Challenge finishChallenge(String id, List<String> imageUrls) {
        Challenge challenge = getChallengeById(id).orElseThrow();
        challenge.setStatus("Completed");
        challenge.setUploadedImages(imageUrls);
        return challengeRepository.save(challenge);
    }

    private boolean isExpired(Challenge challenge) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        LocalDate challengeDate = LocalDate.parse(challenge.getStartDate());
        LocalTime end = LocalTime.parse(challenge.getEndTime());

        return challengeDate.isBefore(today) || (challengeDate.isEqual(today) && now.isAfter(end));
    }

    // public Challenge pauseChallenge(String id) {
    //     // Update the challenge status to "pause"
    //     Challenge challenge = challengeRepository.findById(id).orElseThrow();
    //     challenge.setStatus("pause");
    //     return challengeRepository.save(challenge);
    // }

    public Challenge pauseChallenge(String id) {
        Optional<Challenge> optionalChallenge = challengeRepository.findById(id);
        if (optionalChallenge.isPresent()) {
            Challenge challenge = optionalChallenge.get();
            challenge.setStatus("Paused"); // or "pending" based on your needs
            return challengeRepository.save(challenge);
        } else {
            throw new RuntimeException("Challenge not found with ID: " + id);
        }
    }
    

    public Challenge updateChallenge(String id, Challenge updatedChallenge) {
        Challenge existingChallenge = challengeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Challenge not found with id: " + id));
    
        // Update fields (you can add more as needed)
        existingChallenge.setStatus(updatedChallenge.getStatus());
        existingChallenge.setStartDate(updatedChallenge.getStartDate());
        existingChallenge.setStartTime(updatedChallenge.getStartTime());
        existingChallenge.setEndTime(updatedChallenge.getEndTime());
    
        // Save the updated challenge
        return challengeRepository.save(existingChallenge);
    }
    
    
}

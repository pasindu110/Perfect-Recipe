package com.perfectrecipe.controller;

import com.perfectrecipe.model.AboutInfo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/about")
public class AboutController {

    @GetMapping
    public AboutInfo getAboutInfo() {
        AboutInfo aboutInfo = new AboutInfo();
        
        aboutInfo.setName("Perfect Recipe");
        aboutInfo.setVersion("1.0.0");
        aboutInfo.setDescription("A platform for sharing and discovering delicious recipes");
        aboutInfo.setMission("To connect food lovers and help them discover, share, and create amazing recipes");
        aboutInfo.setFeatures(Arrays.asList(
            "Recipe sharing and discovery",
            "User profiles and collections",
            "Recipe ratings and reviews",
            "Search and filtering capabilities"
        ));
        
        Map<String, String> team = new HashMap<>();
        team.put("founder", "John Doe");
        team.put("leadDeveloper", "Jane Smith");
        team.put("designer", "Alex Johnson");
        team.put("contentManager", "Sarah Williams");
        
        aboutInfo.setTeam(team);
        
        Map<String, String> contact = new HashMap<>();
        contact.put("email", "info@perfectrecipe.com");
        contact.put("phone", "+1 (555) 123-4567");
        contact.put("address", "123 Food Street, Cuisine City, FC 12345");
        
        aboutInfo.setContact(contact);
        
        return aboutInfo;
    }
} 
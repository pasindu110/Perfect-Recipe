package com.perfectrecipe.model;

import java.util.Map;

public class GoogleOAuth2User {
    private String id;
    private String email;
    private String name;
    private String picture;

    public GoogleOAuth2User(Map<String, Object> attributes) {
        this.id = (String) attributes.get("sub");
        this.email = (String) attributes.get("email");
        this.name = (String) attributes.get("name");
        this.picture = (String) attributes.get("picture");
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPicture() {
        return picture;
    }
} 
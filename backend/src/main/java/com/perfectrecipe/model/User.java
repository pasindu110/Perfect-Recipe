package com.perfectrecipe.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    private String id;
    private String email;
    private String password;
    private String fullName;
    private String displayName;
    private String username;
    private List<String> roles;
    private String createdAt;
    private String updatedAt;
    private String phoneNumber;
    private String secondaryEmail;
    private String country;
    private String state;
    private String zipCode;
    private String profileImageUrl;
    private Map<String, Object> shippingAddress;
    private Map<String, Object> billingAddress;
    private String name;
    private String profilePicture;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
} 
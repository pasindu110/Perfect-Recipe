package com.perfectrecipe.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AboutInfo {
    private String name;
    private String version;
    private String description;
    private String mission;
    private List<String> features;
    private Map<String, String> team;
    private Map<String, String> contact;
} 
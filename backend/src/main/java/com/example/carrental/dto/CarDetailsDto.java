package com.example.carrental.dto;

import java.util.List;

public class CarDetailsDto {

    private Long id;
    private String title;
    private Double price;
    private String transmission;
    private String location;

    private List<String> exteriorImages;
    private List<String> interiorImages;
    private List<String> featureImages;

    // ✅ GETTERS & SETTERS (THIS CLEARS WARNINGS)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getTransmission() {
        return transmission;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<String> getExteriorImages() {
        return exteriorImages;
    }

    public void setExteriorImages(List<String> exteriorImages) {
        this.exteriorImages = exteriorImages;
    }

    public List<String> getInteriorImages() {
        return interiorImages;
    }

    public void setInteriorImages(List<String> interiorImages) {
        this.interiorImages = interiorImages;
    }

    public List<String> getFeatureImages() {
        return featureImages;
    }

    public void setFeatureImages(List<String> featureImages) {
        this.featureImages = featureImages;
    }
}

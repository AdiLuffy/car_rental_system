package com.example.carrental.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(nullable = false)
    private int price = 0;

    private String location;

    private String transmission;

    @Column(name = "engine_cc")
    private Integer engineCc;

    // ✅ FIXED COLUMN NAMES + DEFAULTS
    @Column(name = "spare_key", nullable = false)
    private boolean spareKey = false;

    @Column(name = "no_accident", nullable = false)
    private boolean noAccident = false;

    @Column(name = "no_repaint", nullable = false)
    private boolean noRepaint = false;

    @Column(name = "fuel_efficient", nullable = false)
    private boolean fuelEfficient = false;

    @Column(name = "no_water_damage", nullable = false)
    private boolean noWaterDamage = false;

    @Column(name = "no_odometer_tampering", nullable = false)
    private boolean noOdometerTampering = false;

    @Column(nullable = false)
    private boolean approved = false;

    @Column(nullable = false)
    private boolean sold = false;

    // ✅ THIS WAS CRASHING YOUR INSERT
    @Column(name = "km_driven", nullable = false)
    private int kmDriven = 0;

    // ---------- IMAGES ----------
    @ElementCollection
    @CollectionTable(name = "car_exterior_images", joinColumns = @JoinColumn(name = "car_id"))
    @Column(name = "image")
    private List<String> exteriorImages;

    @ElementCollection
    @CollectionTable(name = "car_interior_images", joinColumns = @JoinColumn(name = "car_id"))
    @Column(name = "image")
    private List<String> interiorImages;

    // ---------- GETTERS & SETTERS ----------

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }

    public Integer getEngineCc() { return engineCc; }
    public void setEngineCc(Integer engineCc) { this.engineCc = engineCc; }

    public boolean isSpareKey() { return spareKey; }
    public void setSpareKey(boolean spareKey) { this.spareKey = spareKey; }

    public boolean isNoAccident() { return noAccident; }
    public void setNoAccident(boolean noAccident) { this.noAccident = noAccident; }

    public boolean isNoRepaint() { return noRepaint; }
    public void setNoRepaint(boolean noRepaint) { this.noRepaint = noRepaint; }

    public boolean isFuelEfficient() { return fuelEfficient; }
    public void setFuelEfficient(boolean fuelEfficient) { this.fuelEfficient = fuelEfficient; }

    public boolean isNoWaterDamage() { return noWaterDamage; }
    public void setNoWaterDamage(boolean noWaterDamage) { this.noWaterDamage = noWaterDamage; }

    public boolean isNoOdometerTampering() { return noOdometerTampering; }
    public void setNoOdometerTampering(boolean noOdometerTampering) {
        this.noOdometerTampering = noOdometerTampering;
    }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }

    public boolean isSold() { return sold; }
    public void setSold(boolean sold) { this.sold = sold; }

    public int getKmDriven() { return kmDriven; }
    public void setKmDriven(int kmDriven) { this.kmDriven = kmDriven; }

    public List<String> getExteriorImages() { return exteriorImages; }
    public void setExteriorImages(List<String> exteriorImages) {
        this.exteriorImages = exteriorImages;
    }

    public List<String> getInteriorImages() { return interiorImages; }
    public void setInteriorImages(List<String> interiorImages) {
        this.interiorImages = interiorImages;
    }
}

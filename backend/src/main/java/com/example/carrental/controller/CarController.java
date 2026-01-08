package com.example.carrental.controller;

import com.example.carrental.model.Car;
import com.example.carrental.repository.CarRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:5173")
public class CarController {

    private final CarRepository carRepository;

    // ✅ FIX: uploadDir was missing
    private final Path uploadDir = Paths.get("uploads");

    public CarController(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    // ---------------- GET ALL APPROVED + NOT SOLD CARS ----------------
    @GetMapping
    public List<Car> getAllCars() {
        return carRepository.findByApprovedTrueAndSoldFalse();
    }

    // ---------------- GET CAR BY ID ----------------
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        return carRepository.findById(id)
                .filter(car -> car.isApproved() && !car.isSold())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------- CREATE CAR ----------------
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Car> createCar(

            @RequestParam String title,
            @RequestParam int price,
            @RequestParam String location,
            @RequestParam String transmission,
            @RequestParam int engineCc,

            @RequestParam(defaultValue = "0") int kmDriven,

            @RequestParam(defaultValue = "false") boolean spareKey,
            @RequestParam(defaultValue = "false") boolean noAccident,
            @RequestParam(defaultValue = "false") boolean noRepaint,
            @RequestParam(defaultValue = "false") boolean fuelEfficient,
            @RequestParam(defaultValue = "false") boolean noWaterDamage,
            @RequestParam(defaultValue = "false") boolean noOdometerTampering,

            @RequestParam(required = false) MultipartFile[] exteriorImages,
            @RequestParam(required = false) MultipartFile[] interiorImages
    ) {
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            Car car = new Car();
            car.setTitle(title);
            car.setPrice(price);
            car.setLocation(location);
            car.setTransmission(transmission);
            car.setEngineCc(engineCc);
            car.setKmDriven(kmDriven);

            car.setSpareKey(spareKey);
            car.setNoAccident(noAccident);
            car.setNoRepaint(noRepaint);
            car.setFuelEfficient(fuelEfficient);
            car.setNoWaterDamage(noWaterDamage);
            car.setNoOdometerTampering(noOdometerTampering);

            car.setApproved(false); // admin approval
            car.setSold(false);     // not sold initially

            car.setExteriorImages(saveImages(exteriorImages));
            car.setInteriorImages(saveImages(interiorImages));

            return ResponseEntity.ok(carRepository.save(car));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // ---------------- IMAGE SAVE ----------------
    private List<String> saveImages(MultipartFile[] files) throws Exception {
        List<String> names = new ArrayList<>();

        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    Files.copy(
                            file.getInputStream(),
                            uploadDir.resolve(filename),
                            StandardCopyOption.REPLACE_EXISTING
                    );
                    names.add(filename);
                }
            }
        }
        return names;
    }
}

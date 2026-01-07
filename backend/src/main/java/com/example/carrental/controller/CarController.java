package com.example.carrental.controller;

import com.example.carrental.model.Car;
import com.example.carrental.repository.CarRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:5173")
public class CarController {

    private final CarRepository carRepository;
    private final Path uploadDir = Paths.get("uploads");

    public CarController(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    // Get all approved cars
    @GetMapping
    public List<Car> getAllCars() {
        return carRepository.findByApprovedTrue();
    }

    // Get car by ID (only approved cars visible to users)
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Car car = carRepository.findById(id).orElse(null);
        if (car == null) {
            return ResponseEntity.notFound().build();
        }
        // Only return approved cars to regular users
        if (!car.isApproved()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(car);
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createCar(
            @RequestParam String title,
            @RequestParam int price,
            @RequestParam String location,
            @RequestParam String transmission,

            // ✅ BOOLEAN FIELDS (VERY IMPORTANT)
            @RequestParam(defaultValue = "false") boolean spareKey,
            @RequestParam(defaultValue = "false") boolean noAccident,
            @RequestParam(defaultValue = "false") boolean noRepaint,
            @RequestParam(defaultValue = "false") boolean fuelEfficient,
            @RequestParam(defaultValue = "false") boolean noWaterDamage,
            @RequestParam(defaultValue = "false") boolean noOdometerTampering,

            // ✅ IMAGES
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

            car.setSpareKey(spareKey);
            car.setNoAccident(noAccident);
            car.setNoRepaint(noRepaint);
            car.setFuelEfficient(fuelEfficient);
            car.setNoWaterDamage(noWaterDamage);
            car.setNoOdometerTampering(noOdometerTampering);

            car.setApproved(false);
            car.setSold(false);
            car.setKmDriven(0); // Default value

            List<String> extImages = saveImages(exteriorImages);
            List<String> intImages = saveImages(interiorImages);
            
            // Ensure lists are not null
            car.setExteriorImages(extImages != null ? extImages : new ArrayList<>());
            car.setInteriorImages(intImages != null ? intImages : new ArrayList<>());

            Car savedCar = carRepository.save(car);
            return ResponseEntity.ok(savedCar);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create car: " + e.getMessage()));
        }
    }

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

package com.example.carrental.controller;

import com.example.carrental.model.Car;
import com.example.carrental.repository.CarRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final CarRepository repo;

    public AdminController(CarRepository repo) {
        this.repo = repo;
    }

    // 🔴 Cars pending approval
    @GetMapping("/pending")
    public List<Car> pendingCars() {
        return repo.findByApprovedFalse();
    }

    // ✅ Approve car
    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveCar(@PathVariable Long id) {
        try {
            Car car = repo.findById(id).orElse(null);
            if (car == null) {
                return ResponseEntity.notFound().build();
            }
            car.setApproved(true);
            repo.save(car);
            return ResponseEntity.ok(Map.of("message", "Car approved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to approve car: " + e.getMessage()));
        }
    }

    // ❌ Reject (delete) car
    @DeleteMapping("/reject/{id}")
    public ResponseEntity<?> rejectCar(@PathVariable Long id) {
        try {
            if (!repo.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            repo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Car rejected successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to reject car: " + e.getMessage()));
        }
    }
}

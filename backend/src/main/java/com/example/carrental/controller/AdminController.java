package com.example.carrental.controller;

import com.example.carrental.model.Car;
import com.example.carrental.repository.CarRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final CarRepository repo;

    public AdminController(CarRepository repo) {
        this.repo = repo;
    }

    // ✅ Pending cars
    @GetMapping("/pending")
    public List<Car> pending() {
        return repo.findByApprovedFalseAndSoldFalse();
    }

    // ✅ Approve car
    @PatchMapping("/approve/{id}")
    public Car approve(@PathVariable Long id) {
        Car car = repo.findById(id).orElseThrow();
        car.setApproved(true);
        return repo.save(car);
    }
}

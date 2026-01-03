package com.example.carrental.controller;

import com.example.carrental.model.Car;
import com.example.carrental.repository.CarRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin
public class CarController {

    private final CarRepository repo;

    public CarController(CarRepository repo) {
        this.repo = repo;
    }

    // ✅ Home page cars
    @GetMapping
    public List<Car> approvedCars() {
        return repo.findByApprovedTrueAndSoldFalse();
    }

    // ✅ Sell / add car (initially not approved)
    @PostMapping
    public Car addCar(@RequestBody Car car) {
        car.setApproved(false);
        car.setSold(false);
        return repo.save(car);
    }
}

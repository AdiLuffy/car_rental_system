package com.example.carrental.repository;

import com.example.carrental.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    // ✅ For public listing (Buy Used Cars)
    List<Car> findByApprovedTrueAndSoldFalse();

    // 🔴 For Admin → Pending approval
    List<Car> findByApprovedFalse();
}

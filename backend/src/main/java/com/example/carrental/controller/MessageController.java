package com.example.carrental.controller;

import com.example.carrental.model.Car;
import com.example.carrental.model.Message;
import com.example.carrental.model.User;
import com.example.carrental.repository.CarRepository;
import com.example.carrental.repository.MessageRepository;
import com.example.carrental.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173") // ✅ correct frontend port
public class MessageController {

    private final MessageRepository messages;
    private final UserRepository users;
    private final CarRepository cars;

    public MessageController(
            MessageRepository messages,
            UserRepository users,
            CarRepository cars
    ) {
        this.messages = messages;
        this.users = users;
        this.cars = cars;
    }

    // ✅ Send message (NO AUTH FOR NOW)
    @PostMapping
    public ResponseEntity<?> send(@RequestBody Message msg) {

        msg.setId(null);

        // Validate sender
        if (msg.getSender() == null || msg.getSender().getId() == null) {
            return ResponseEntity.badRequest().body("Sender is required");
        }

        User sender = users.findById(msg.getSender().getId()).orElse(null);
        if (sender == null) {
            return ResponseEntity.badRequest().body("Sender not found");
        }
        msg.setSender(sender);

        // Validate recipient
        if (msg.getRecipient() == null || msg.getRecipient().getId() == null) {
            return ResponseEntity.badRequest().body("Recipient is required");
        }

        User recipient = users.findById(msg.getRecipient().getId()).orElse(null);
        if (recipient == null) {
            return ResponseEntity.badRequest().body("Recipient not found");
        }
        msg.setRecipient(recipient);

        // Optional car link
        if (msg.getCar() != null && msg.getCar().getId() != null) {
            Car car = cars.findById(msg.getCar().getId()).orElse(null);
            if (car == null) {
                return ResponseEntity.badRequest().body("Car not found");
            }
            msg.setCar(car);
        } else {
            msg.setCar(null);
        }

        Message saved = messages.save(msg);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ✅ Get messages by car
    @GetMapping("/car/{carId}")
    public ResponseEntity<List<Message>> byCar(@PathVariable Long carId) {

        if (!cars.existsById(carId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(messages.findByCarId(carId));
    }
}

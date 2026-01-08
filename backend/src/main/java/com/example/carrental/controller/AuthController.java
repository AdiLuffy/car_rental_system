package com.example.carrental.controller;

import com.example.carrental.model.Role;
import com.example.carrental.model.User;
import com.example.carrental.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public AuthController(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        String email = user.getEmail().toLowerCase();

        if (userRepo.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already exists"));
        }

        user.setEmail(email);
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole(Role.USER); // ✅ ENUM FIX

        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "Registered successfully"));
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User req) {

        User user = userRepo.findByEmail(req.getEmail().toLowerCase())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email"));
        }

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid password"));
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "role", user.getRole() // USER / ADMIN
        ));
    }
}

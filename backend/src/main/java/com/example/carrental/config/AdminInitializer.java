package com.example.carrental.config;

import com.example.carrental.model.Role;
import com.example.carrental.model.User;
import com.example.carrental.repository.UserRepository;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public AdminInitializer(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @EventListener(ContextRefreshedEvent.class)
    public void createAdminIfNotExists() {

        String adminEmail = "dandaadithya9@gmail.com";

        if (userRepo.existsByEmail(adminEmail)) return;

        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setPassword(encoder.encode("admin123"));
        admin.setRole(Role.ADMIN);

        userRepo.save(admin);

        System.out.println("✅ ADMIN CREATED: " + adminEmail);
    }
}

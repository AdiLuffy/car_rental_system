package com.example.carrental.config;

import com.example.carrental.model.Role;
import com.example.carrental.model.User;
import com.example.carrental.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {

            String adminEmail = "dandaadithya9@gmail.com";

            userRepository.findByEmail(adminEmail).ifPresentOrElse(
                user -> {
                    user.setRole(Role.ADMIN);   // ✅ FIX
                    userRepository.save(user);
                },
                () -> {
                    User admin = new User();
                    admin.setEmail(adminEmail);
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole(Role.ADMIN); // ✅ FIX
                    userRepository.save(admin);
                }
            );
        };
    }
}

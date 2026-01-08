package com.example.carrental.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // 🔐 REQUIRED FOR LOGIN / REGISTER
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔓 DEV MODE SECURITY (NO JWT)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers(
                    "/uploads/**",
                    "/api/auth/**",
                    "/api/cars/**",
                    "/api/admin/**",
                    "/h2-console/**"
                ).permitAll()
                .anyRequest().authenticated();

        // ✅ H2 console fix
        http.headers().frameOptions().disable();

        return http.build();
    }
}

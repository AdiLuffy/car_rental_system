package com.example.carrental.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers(
                    "/uploads/**",
                    "/api/auth/**",
                    "/api/cars/**",
                    "/api/messages/**",
                    "/api/admin/**",
                    "/h2-console/**"
                ).permitAll()
                .anyRequest().authenticated();
        
        http.headers().frameOptions().disable();

        return http.build();
    }
}

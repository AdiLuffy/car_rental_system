package com.example.carrental.security;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ ALLOW IMAGES WITHOUT AUTH
        if (path.startsWith("/uploads/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔹 FOR NOW: LET EVERYTHING ELSE PASS
        // (You are not using JWT yet)
        filterChain.doFilter(request, response);
    }
}

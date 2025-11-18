package com.example.taskapp.controller;

import com.example.taskapp.dto.LoginRequest;
import com.example.taskapp.dto.RegisterRequest;
import com.example.taskapp.entity.User;
import com.example.taskapp.security.JwtUtil;
import com.example.taskapp.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    // 新規登録（JWTを返す）
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    // ログイン（JWTを返す）
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // ログイン中のユーザー情報
    @GetMapping("/me")
    public User me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return authService.getCurrentUser(email);
    }
}

package com.example.taskapp.controller;

import com.example.taskapp.dto.LoginRequest;
import com.example.taskapp.dto.LoginResponse;
import com.example.taskapp.dto.LoginResponse;
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

    @PostMapping("/register")
    public LoginResponse register(@RequestBody RegisterRequest request) {
        String token = authService.register(request);
        return new LoginResponse(token);  // ← 登録時も JSON 返す
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        String token = authService.login(request);
        return new LoginResponse(token);  // ← JSON {"token": "..."} で返す
    }

    // ログイン中のユーザー情報
    @GetMapping("/me")
    public User me(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return authService.getCurrentUser(email);
    }
}

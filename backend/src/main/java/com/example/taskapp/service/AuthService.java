package com.example.taskapp.service;

import com.example.taskapp.dto.LoginRequest;
import com.example.taskapp.dto.RegisterRequest;
import com.example.taskapp.entity.User;
import com.example.taskapp.repository.UserRepository;
import com.example.taskapp.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 新規登録
    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("メールアドレスは既に使用されています。");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // ハッシュ化
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        // 登録後すぐログイン扱いにしてJWTを返す
        return jwtUtil.generateToken(user.getEmail());
    }

    // ログイン
    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません。"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("パスワードが違います。");
        }

        return jwtUtil.generateToken(user.getEmail());
    }

    // 自分の情報取得
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません。"));
    }
}

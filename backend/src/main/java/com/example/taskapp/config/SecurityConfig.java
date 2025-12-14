package com.example.taskapp.config;

import com.example.taskapp.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

import java.util.List;

@Configuration
@EnableMethodSecurity
@Profile("!test")
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable()).cors(cors -> cors.configurationSource(request -> {
            var corsConfig = new org.springframework.web.cors.CorsConfiguration();
            corsConfig.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173",
                    "https://task-manager-7k8.pages.dev", "https://task-manager-dev.pages.dev"));
            corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            corsConfig.setAllowedHeaders(List.of("*"));
            corsConfig.setAllowCredentials(true);
            return corsConfig;
        })).sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // public API
                        .requestMatchers("/api/tasks/public/**").permitAll()

                        // subtasks（ログイン不要）
                        .requestMatchers("/api/tasks/*/subtasks/**").permitAll()

                        // ★ AI判断（これを必ず追加）
                        .requestMatchers("/api/tasks/*/ai/decision").permitAll()

                        // auth
                        .requestMatchers("/auth/**").permitAll()

                        // その他 API
                        .requestMatchers("/api/**").authenticated()

                        .requestMatchers("/api/tasks/*/state").permitAll()

                        .requestMatchers(HttpMethod.PUT, "/api/tasks/*/state").permitAll()

                        .requestMatchers(HttpMethod.PUT, "/api/tasks/public/**").permitAll()

                        // ★ AI判断ログ（public）
                        .requestMatchers("/api/tasks/public/*/ai/logs").permitAll()


                        .anyRequest().permitAll())
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}

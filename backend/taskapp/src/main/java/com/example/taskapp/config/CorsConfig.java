package com.example.taskapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                                "http://localhost:5173",
                                "https://task-manager-portfolio-v2.vercel.app",
                                "https://task-manager-portfolio-v2-git-main-shotas-projects-7e17bf9d.vercel.app",
                                "https://task-manager-portfolio-v2-h2giwkwfi-shotas-projects-7e17bf9d.vercel.app"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(false);
            }
        };
    }
}

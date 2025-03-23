package com.project.Agency;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Дозволяємо доступ до всіх ендпоінтів
                .allowedOrigins("http://localhost:3000") // Дозволяємо запити з фронтенду
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Дозволені HTTP-методи
                .allowedHeaders("*"); // Дозволяємо всі заголовки
    }
}

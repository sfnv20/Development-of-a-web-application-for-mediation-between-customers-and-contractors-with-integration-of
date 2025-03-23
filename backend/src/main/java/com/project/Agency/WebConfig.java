package com.project.Agency;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Дозволяємо всі шляхи
                .allowedOrigins("http://localhost:3000") // Дозволяємо запити з фронтенду
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Дозволені HTTP-методи
                .allowedHeaders("*") // Дозволяємо всі заголовки
                .exposedHeaders("Authorization"); // Заголовки, які можуть бути доступні на фронтенді
    }
}

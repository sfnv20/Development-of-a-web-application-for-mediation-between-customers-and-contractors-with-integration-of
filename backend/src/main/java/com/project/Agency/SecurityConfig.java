package com.project.Agency;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .cors().and() // Дозволяємо CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Дозволяємо доступ до ендпоінтів авторизації та реєстрації
                        .requestMatchers("/admin/**").hasRole("ADMIN") // Доступ до адмін-панелі лише для ADMIN
                        .requestMatchers("/executor/**").hasRole("EXECUTOR") // Доступ до ресурсів виконавця лише для EXECUTOR
                        .requestMatchers("/client/**").hasRole("CLIENT") // Доступ до ресурсів клієнта лише для CLIENT
                        .anyRequest().permitAll() // Дозволяємо всі інші запити без авторизації
                )
                .formLogin().disable() // Вимикаємо форму логіну, оскільки використовуємо REST API
                .httpBasic(); // Використовуємо базову авторизацію для тестування через Postman або браузер

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}

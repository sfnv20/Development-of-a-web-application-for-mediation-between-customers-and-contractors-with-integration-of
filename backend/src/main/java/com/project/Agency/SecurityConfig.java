package com.project.Agency;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

    @Configuration
    public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http.csrf().disable()
                    .cors().and() // Включаємо підтримку CORS
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/api/auth/**").permitAll() // Доступ до реєстрації та логіну
                            .requestMatchers("/api/admin/**").hasAuthority("ADMIN") // Адмін-панель лише для адміністраторів
                            .requestMatchers("/api/orders/**").hasAnyAuthority("ADMIN", "EXECUTOR") // Замовлення для адміністраторів і виконавців
                            .anyRequest().authenticated()
                    )
                    .httpBasic();
            return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }

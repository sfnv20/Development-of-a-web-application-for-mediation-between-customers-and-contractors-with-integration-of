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
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Дозволяємо доступ до авторизації та реєстрації без токена
                        .requestMatchers("/api/orders/create").hasAnyRole("CLIENT", "ADMIN") // Захищаємо створення замовлень
                        .requestMatchers("/api/orders").hasAnyRole("CLIENT", "ADMIN") // Захищаємо доступ до списку замовлень
                        .anyRequest().permitAll() // Дозволяємо доступ до інших ендпоінтів без авторизації
                )
                .formLogin().disable() // Вимикаємо стандартну форму логіну
                .httpBasic(); // Використовуємо Basic Authentication

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

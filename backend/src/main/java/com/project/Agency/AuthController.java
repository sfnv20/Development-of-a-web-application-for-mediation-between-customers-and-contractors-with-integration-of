package com.project.Agency;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.OK) // Повертаємо статус 200 OK
    public String register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Ця електронна пошта вже зареєстрована";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setType(UserType.UNCONFIRMED); // Новий користувач отримує тип UNCONFIRMED за замовчуванням
        userRepository.save(user);
        return "Реєстрація успішна!";
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK) // Повертаємо статус 200 OK
    public String login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return "Невірний пароль";
        }

        if (user.getType() == UserType.UNCONFIRMED) {
            return "Ваш акаунт ще не підтверджений адміністратором";
        }

        return "Вхід успішний!";
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));
        return ResponseEntity.ok(user); // Повертаємо всю інформацію про користувача
    }
}

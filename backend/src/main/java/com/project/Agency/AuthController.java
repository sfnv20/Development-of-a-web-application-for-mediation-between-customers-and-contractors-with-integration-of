package com.project.Agency;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Невірний пароль");
        }

        // Створюємо сесію та зберігаємо тип користувача
        HttpSession session = request.getSession();
        session.setAttribute("userId", user.getId());
        session.setAttribute("userType", user.getType());

        return ResponseEntity.ok("Вхід успішний!");
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));
        return ResponseEntity.ok(user); // Повертаємо всю інформацію про користувача
    }
}

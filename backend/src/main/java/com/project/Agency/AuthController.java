package com.project.Agency;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) { // Явний конструктор
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getPassword() == null || user.getType() == null) {
            return ResponseEntity.badRequest().body("Пароль і тип не можуть бути порожніми");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Ця електронна пошта вже зареєстрована");
        }

        userRepository.save(user);
        return ResponseEntity.ok("Користувач успішно зареєстрований");
    }
}

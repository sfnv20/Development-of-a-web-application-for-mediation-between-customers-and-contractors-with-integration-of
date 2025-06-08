package com.project.Agency;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Дозволяємо запити з фронтенду
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Реєстрація нового користувача
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email вже використовується");
        }

        user.setRole(User.Role.UNCONFIRMED); // Тип "UNCONFIRMED" за замовчуванням
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return "Користувач успішно зареєстрований. Очікуйте підтвердження адміністратора.";
    }

    // Авторизація користувача
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        // Перевірка наявності користувача за email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", true);
            errorResponse.put("message", "Користувач із таким email не знайдений.");
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        // Перевірка пароля
        if (!passwordEncoder.matches(password, user.getPassword())) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", true);
            errorResponse.put("message", "Невірний пароль.");
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        // Перевірка ролі користувача
        if (user.getRole() == User.Role.UNCONFIRMED) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", true);
            errorResponse.put("message", "Ваш обліковий запис ще не підтверджено адміністратором.");
            return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        }

        // Формування успішної відповіді
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("message", "Авторизація успішна!");
        successResponse.put("fullName", user.getFullName());
        successResponse.put("role", user.getRole());
        successResponse.put("id", user.getId());
        return new ResponseEntity<>(successResponse, HttpStatus.OK);
    }
}

package com.project.Agency;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Ця електронна пошта вже зареєстрована");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setType(UserType.CLIENT); // Новий користувач отримує роль CLIENT за замовчуванням
        user.setApproved(false); // Користувач ще не підтверджений адміністратором
        userRepository.save(user);
        return ResponseEntity.ok("Реєстрація успішна! Очікуйте підтвердження від адміністратора.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmailAndIsApprovedTrue(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено або він не підтверджений"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Неправильний пароль");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}

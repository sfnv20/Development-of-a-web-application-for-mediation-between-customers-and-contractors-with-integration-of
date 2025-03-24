package com.project.Agency;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Реєстрація нового користувача
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

    // Авторизація користувача
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Аутентифікація користувача
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        // Збереження аутентифікації в контексті безпеки
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Перевірка ролі користувача
        User user = (User) authentication.getPrincipal();
        if (user.getType() == UserType.ADMIN) {
            return ResponseEntity.ok("Вхід успішний! Ви авторизовані як ADMIN.");
        } else if (user.getType() == UserType.CLIENT) {
            return ResponseEntity.ok("Вхід успішний! Ви авторизовані як CLIENT.");
        } else {
            return ResponseEntity.status(403).body("Невідома роль користувача.");
        }
    }
}

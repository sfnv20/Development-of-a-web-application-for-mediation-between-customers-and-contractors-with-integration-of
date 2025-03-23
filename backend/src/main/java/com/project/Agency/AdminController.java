package com.project.Agency;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/unapproved-users")
    public List<User> getUnapprovedUsers() {
        return userRepository.findByIsApprovedFalse();
    }

    @PutMapping("/assign-role/{userId}")
    public ResponseEntity<?> assignRole(@PathVariable Long userId, @RequestParam String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

        user.setType(UserType.valueOf(role)); // Призначаємо нову роль
        user.setApproved(true); // Підтверджуємо користувача
        userRepository.save(user);

        return ResponseEntity.ok("Роль " + role + " успішно призначена користувачу " + user.getEmail());
    }
}

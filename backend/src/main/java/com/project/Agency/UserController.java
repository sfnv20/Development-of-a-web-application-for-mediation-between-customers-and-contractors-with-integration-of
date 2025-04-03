package com.project.Agency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Зміна ролі користувача (тільки адміністратор)
    @PutMapping("/{userId}/change-role")
    public User changeUserRole(
            @RequestHeader("User-role") String role,
            @PathVariable Long userId,
            @RequestParam String newRole
    ) {
        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Доступ заборонено: тільки адміністратор може змінювати роль користувача");
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Користувач не знайдений"));
        user.setRole(User.Role.valueOf(newRole.toUpperCase()));
        return userRepository.save(user);
    }
}

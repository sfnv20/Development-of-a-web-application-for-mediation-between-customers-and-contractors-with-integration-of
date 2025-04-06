package com.project.Agency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Отримати список усіх користувачів
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // Оновити роль користувача
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(User.Role.valueOf(newRole));
                    userRepository.save(user);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    // Видалити користувача за ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // Видаляємо всі замовлення, де користувач є виконавцем
        orderRepository.findByExecutorId(id).forEach(order -> {
            order.setExecutor(null); // Встановлюємо executor_id у NULL
            orderRepository.save(order);
        });

        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // Повертаємо статус 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // Повертаємо статус 404 Not Found
        }
    }
}
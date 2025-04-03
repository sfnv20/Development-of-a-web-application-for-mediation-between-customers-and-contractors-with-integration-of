package com.project.Agency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Підтвердження користувача після реєстрації
    @PutMapping("/confirm-user/{userId}")
    public User confirmUser(@RequestHeader("User-Role") String role, @PathVariable Long userId) {
        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Доступ заборонено: тільки адміністратор може підтверджувати користувачів");
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Користувач не знайдений"));
        user.setRole(User.Role.CLIENT); // Призначаємо роль CLIENT або EXECUTOR
        return userRepository.save(user);
    }

    // Підтвердження замовлення
    @PutMapping("/confirm-order/{orderId}")
    public Order confirmOrder(@RequestHeader("User-Role") String role, @PathVariable Long orderId) {
        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Доступ заборонено: тільки адміністратор може підтверджувати замовлення");
        }
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Замовлення не знайдено"));
        order.setStatus(Order.Status.APPROVED);
        return orderRepository.save(order);
    }

}

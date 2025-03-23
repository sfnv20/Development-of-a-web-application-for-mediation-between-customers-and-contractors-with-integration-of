package com.project.Agency;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository; // Поле має бути final
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Користувач не автентифікований");
        }

        User user = (User) authentication.getPrincipal(); // Отримуємо поточного користувача

        if (!user.getType().equals(UserType.CLIENT)) { // Перевіряємо тип користувача
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Тільки клієнти можуть створювати замовлення");
        }

        order.setClient(user); // Прив'язуємо замовлення до клієнта
        orderRepository.save(order);
        return ResponseEntity.ok("Замовлення успішно створено");
    }


    @GetMapping
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        logger.info("Отримані замовлення: {}", orders);
        return orders;
    }


    @PutMapping("/{orderId}/assign-executor")
    public ResponseEntity<?> assignExecutor(@PathVariable Long orderId, @RequestBody Long executorId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        User executor = userRepository.findById(executorId).orElseThrow();
        order.setExecutor(executor);
        orderRepository.save(order);
        return ResponseEntity.ok("Виконавець призначений");
    }
}

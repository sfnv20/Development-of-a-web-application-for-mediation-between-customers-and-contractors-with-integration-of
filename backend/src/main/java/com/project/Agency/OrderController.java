package com.project.Agency;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @GetMapping
    public ResponseEntity<?> getAllOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal(); // Отримуємо поточного користувача

        logger.info("Поточний користувач: {}", user.getEmail());

        if (user.getType() == UserType.CLIENT) {
            List<Order> clientOrders = orderRepository.findByClient(user);
            logger.info("Замовлення клієнта: {}", clientOrders);
            return ResponseEntity.ok(clientOrders);
        } else if (user.getType() == UserType.ADMIN) {
            List<Order> allOrders = orderRepository.findAll();
            logger.info("Усі замовлення: {}", allOrders);
            return ResponseEntity.ok(allOrders);
        } else {
            logger.warn("Доступ заборонено для користувача: {}", user.getEmail());
            return ResponseEntity.status(403).body("Доступ заборонено.");
        }
    }
}

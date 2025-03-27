package com.project.Agency;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<?> getAllOrders(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Користувач не авторизований");
        }

        User user = (User) authentication.getPrincipal(); // Отримуємо поточного користувача

        if (user.getType() == UserType.ADMIN) {
            // Адміністратор бачить усі замовлення
            List<Order> allOrders = orderRepository.findAll();
            return ResponseEntity.ok(allOrders);
        } else if (user.getType() == UserType.EXECUTOR) {
            // Виконавець бачить лише замовлення, які йому призначені
            List<Order> executorOrders = orderRepository.findByExecutor(user);
            return ResponseEntity.ok(executorOrders);
        } else {
            // Інші ролі не мають доступу до списку замовлень
            return ResponseEntity.status(403).body("Доступ заборонено.");
        }
    }


    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        User user = (User) authentication.getPrincipal(); // Отримуємо поточного користувача

        if (user.getType() != UserType.CLIENT && user.getType() != UserType.ADMIN) {
            return ResponseEntity.status(403).body("Тільки клієнти та адміністратори можуть створювати замовлення.");
        }

        Order newOrder = new Order();
        newOrder.setTitle(orderRequest.getTitle());
        newOrder.setDescription(orderRequest.getDescription());
        newOrder.setDeadline(orderRequest.getDeadline());
        newOrder.setCreatedAt(LocalDate.now()); // Автоматична генерація дати створення
        newOrder.setClient(user); // Встановлюємо клієнта як поточного користувача

        orderRepository.save(newOrder);

        return ResponseEntity.ok("Замовлення створено успішно!");
    }
}

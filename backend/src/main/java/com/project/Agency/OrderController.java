package com.project.Agency;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
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
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
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

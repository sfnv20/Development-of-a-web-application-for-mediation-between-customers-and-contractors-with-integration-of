package com.project.Agency;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
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

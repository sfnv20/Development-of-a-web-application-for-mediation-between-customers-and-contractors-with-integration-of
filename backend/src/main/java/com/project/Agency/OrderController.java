package com.project.Agency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import static com.project.Agency.User.Role.ADMIN;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }

    // Створити нове замовлення (тільки клієнт або адміністратор)
    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Клієнт не знайдений"));
        Order order = new Order();
        order.setTitle(request.getTitle());
        order.setDescription(request.getDescription());
        order.setDeadline(request.getDeadline());
        order.setClient(client);
        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // Призначити виконавця до замовлення (тільки адміністратор)
    @PutMapping("/{orderId}/assign-executor")
    public Order assignExecutor(
            @RequestHeader("User-Role") String role,
            @PathVariable Long orderId,
            @RequestParam Long executorId
    ) {
        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Доступ заборонено: тільки адміністратор може призначати виконавців");
        }
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Замовлення не знайдено"));
        User executor = userRepository.findById(executorId).orElseThrow(() -> new RuntimeException("Виконавець не знайдений"));
        order.setExecutor(executor);
        return orderRepository.save(order);
    }
}

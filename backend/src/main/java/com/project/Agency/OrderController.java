package com.project.Agency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }

    // Створити нове замовлення (тільки клієнт або адміністратор)
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        // Знаходимо користувача за clientId
        User user = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Користувач не знайдений"));

        // Перевіряємо роль користувача
        if (user.getRole() == User.Role.CLIENT) {
            // Якщо користувач - CLIENT, перевіряємо наявність замовлення зі статусом PENDING
            boolean hasPendingOrder = orderRepository.existsByClientIdAndStatus(request.getClientId(), Order.Status.PENDING);
            if (hasPendingOrder) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("У вас вже є непідтверджене замовлення. Завершіть його перед створенням нового.");
            }
        }

        // Створюємо нове замовлення
        Order order = new Order();
        order.setTitle(request.getTitle());
        order.setDescription(request.getDescription());
        order.setDeadline(request.getDeadline());
        order.setClient(user);
        order.setStatus(Order.Status.PENDING); // Початковий статус - PENDING
        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // Повернути замовлення клієнта
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Order>> getOrdersByClient(@PathVariable Long clientId) {
        List<Order> orders = orderRepository.findByClientId(clientId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/executor/{executorId}/approved")
    public ResponseEntity<List<Order>> getApprovedOrdersByExecutor(@PathVariable Long executorId) {
        List<Order> orders = orderRepository.findByExecutorIdAndStatus(executorId, Order.Status.APPROVED);
        return ResponseEntity.ok(orders);
    }



    // Оновити статус замовлення
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(Order.Status.valueOf(newStatus));
                    orderRepository.save(order);
                    return ResponseEntity.ok(order);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Призначити виконавця до замовлення
    @PutMapping("/{id}/executor")
    public ResponseEntity<Order> assignExecutor(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        Long executorId = request.get("executorId");
        User executor = userRepository.findById(executorId).orElseThrow(() -> new RuntimeException("Виконавець не знайдений"));

        return orderRepository.findById(id)
                .map(order -> {
                    order.setExecutor(executor);
                    orderRepository.save(order);
                    return ResponseEntity.ok(order);
                })
                .orElse(ResponseEntity.notFound().build()); // Повертаємо статус 404 Not Found, якщо замовлення не знайдено
    }

    // Видалити замовлення
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (orderRepository.existsById(id)) {
            requestRepository.deleteByOrderId(id);
            orderRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Отримати замовлення за айді
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Order>> getPendingOrders() {
        List<Order> pendingOrders = orderRepository.findPendingOrders();
        return ResponseEntity.ok(pendingOrders);
    }


    @GetMapping("/executor/{executorId}")
    public ResponseEntity<List<Order>> getOrdersByExecutor(@PathVariable Long executorId) {
        List<Order> executorOrders = orderRepository.findOrdersByExecutor(executorId);
        return ResponseEntity.ok(executorOrders);
    }

    // Отримання завершених замовлень клієнта
    @GetMapping("/client/{clientId}/finished")
    public ResponseEntity<List<Order>> getFinishedOrdersByClient(@PathVariable Long clientId) {
        List<Order> finishedOrders = orderRepository.findFinishedOrdersByClient(clientId);
        return ResponseEntity.ok(finishedOrders);
    }

    // Отримання завершених замовлень виконавця
    @GetMapping("/executor/{executorId}/finished")
    public ResponseEntity<List<Order>> getFinishedOrdersByExecutor(@PathVariable Long executorId) {
        List<Order> finishedOrders = orderRepository.findFinishedOrdersByExecutor(executorId);
        return ResponseEntity.ok(finishedOrders);
    }

    // Отримання всіх завершених замовлень (для адміністратора)
    @GetMapping("/finished")
    public ResponseEntity<List<Order>> getAllFinishedOrders() {
        List<Order> finishedOrders = orderRepository.findAllFinishedOrders();
        return ResponseEntity.ok(finishedOrders);
    }
}

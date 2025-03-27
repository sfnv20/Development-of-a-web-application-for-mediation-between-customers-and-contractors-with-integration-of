package com.project.Agency;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<?> getAllOrders(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        UserType userType = (UserType) session.getAttribute("userType");

        if (userType == UserType.ADMIN) {
            List<Order> allOrders = orderRepository.findAll();
            return ResponseEntity.ok(allOrders);
        } else if (userType == UserType.EXECUTOR) {
            Long userId = (Long) session.getAttribute("userId");
            List<Order> executorOrders = orderRepository.findByExecutorId(userId);
            return ResponseEntity.ok(executorOrders);
        } else if (userType == UserType.CLIENT) {
            Long userId = (Long) session.getAttribute("userId");
            List<Order> clientOrders = orderRepository.findByClientId(userId);
            return ResponseEntity.ok(clientOrders);
        } else {
            return ResponseEntity.status(403).body("Доступ заборонено.");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userType") == null) {
            return ResponseEntity.status(401).body("Користувач не авторизований");
        }

        UserType userType = (UserType) session.getAttribute("userType");
        if (userType != UserType.CLIENT || userType != UserType.ADMIN) {
            return ResponseEntity.status(403).body("Тільки клієнти та адміністратори можуть створювати замовлення.");
        }

        Long clientId = (Long) session.getAttribute("userId");
        Order newOrder = new Order();
        newOrder.setTitle(orderRequest.getTitle());
        newOrder.setDescription(orderRequest.getDescription());
        newOrder.setDeadline(orderRequest.getDeadline());
        newOrder.setCreatedAt(LocalDate.now());
        newOrder.setClientId(clientId);

        orderRepository.save(newOrder);

        return ResponseEntity.ok("Замовлення створено успішно!");
    }
}

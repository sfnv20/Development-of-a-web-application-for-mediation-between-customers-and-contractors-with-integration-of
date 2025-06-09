package com.project.Agency;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // Виконавець подає запит на виконання замовлення
    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> requestData) {
        Long executorId = ((Number) requestData.get("executorId")).longValue();
        Long orderId = ((Number) requestData.get("orderId")).longValue();
        String note = (String) requestData.get("note");

        User executor = userRepository.findById(executorId)
                .orElseThrow(() -> new RuntimeException("Виконавець не знайдений"));
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Замовлення не знайдено"));

        Request request = new Request();
        request.setExecutor(executor);
        request.setOrder(order);
        request.setStatus(Request.Status.PENDING);
        request.setNote(note);

        requestRepository.save(request);
        return ResponseEntity.ok("Запит успішно подано");
    }

    // Отримання всіх запитів для адміністратора
    @GetMapping("/pending")
    public ResponseEntity<List<Request>> getPendingRequests() {
        List<Request> requests = requestRepository.findByStatus(Request.Status.PENDING);
        return ResponseEntity.ok(requests);
    }

    // Одобрення або відхилення запиту адміністратором
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> requestData) {
        String status = requestData.get("status");

        return requestRepository.findById(id)
                .map(request -> {
                    if (status.equals("APPROVED")) {
                        // Призначаємо виконавця на замовлення і видаляємо інші запити
                        Order order = request.getOrder();
                        order.setExecutor(request.getExecutor());
                        orderRepository.save(order);

                        // Видаляємо всі інші запити для цього замовлення
                        List<Request> otherRequests = requestRepository.findByOrderId(order.getId());
                        for (Request otherRequest : otherRequests) {
                            if (!otherRequest.getId().equals(request.getId())) {
                                requestRepository.delete(otherRequest);
                            }
                        }
                    }
                    request.setStatus(Request.Status.valueOf(status));
                    requestRepository.save(request);
                    return ResponseEntity.ok("Статус запиту оновлено");
                })
                .orElse(ResponseEntity.notFound().build());
    }
    // Схвалення запиту та оновлення статусу замовлення
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        return requestRepository.findById(id)
                .map(request -> {
                    // Призначаємо виконавця на замовлення
                    Order order = request.getOrder();
                    order.setExecutor(request.getExecutor());
                    order.setStatus(Order.Status.APPROVED); // Оновлюємо статус замовлення
                    orderRepository.save(order);

                    // Видаляємо всі інші запити для цього замовлення
                    List<Request> otherRequests = requestRepository.findByOrderId(order.getId());
                    for (Request otherRequest : otherRequests) {
                        if (!otherRequest.getId().equals(request.getId())) {
                            requestRepository.delete(otherRequest);
                        }
                    }

                    // Оновлюємо статус запиту на "APPROVED"
                    request.setStatus(Request.Status.APPROVED);
                    requestRepository.save(request);

                    return ResponseEntity.ok("Запит успішно схвалено, статус замовлення оновлено");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

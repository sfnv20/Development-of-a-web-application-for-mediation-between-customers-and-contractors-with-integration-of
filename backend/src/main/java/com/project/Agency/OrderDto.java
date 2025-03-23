package com.project.Agency;

public class OrderDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String clientEmail; // Email клієнта

    public OrderDto(Order order) {
        this.id = order.getId();
        this.title = order.getTitle();
        this.description = order.getDescription();
        this.status = order.getStatus().toString();
        this.clientEmail = order.getClient().getEmail(); // Отримуємо email клієнта
    }
}

package com.project.Agency;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "client_id", nullable = false)
    private Long clientId; // ID замовника

    @Column(name = "executor_id")
    private Long executorId; // ID виконавця (може бути null)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status; // Статус замовлення

    @Column(nullable = false)
    private LocalDate createdAt; // Дата створення замовлення

    private LocalDate deadline; // Дедлайн замовлення
}

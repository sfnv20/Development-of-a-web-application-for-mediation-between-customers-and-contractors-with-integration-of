package com.project.Agency;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false) // Замовник (User)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "executor_id") // Виконавець (User)
    private User executor;

    @Enumerated(EnumType.STRING) // Зберігаємо ENUM як текст у базі даних
    @Column(nullable = false, length = 20)
    private OrderStatus status; // NEW, IN_PROGRESS, COMPLETED

    @Column(nullable = false)
    private LocalDateTime createdAt; // Дата створення замовлення

    private LocalDateTime deadline; // Дедлайн для виконання замовлення
}

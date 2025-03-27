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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnore // Уникаємо серіалізації клієнта для уникнення циклічної залежності
    private User client; // Замовник

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "executor_id")
    @JsonIgnore // Уникаємо серіалізації виконавця для уникнення циклічної залежності
    private User executor; // Виконавець

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status; // Статус замовлення

    @Column(nullable = false)
    private LocalDate createdAt; // Дата створення замовлення

    private LocalDate deadline; // Дедлайн замовлення
}

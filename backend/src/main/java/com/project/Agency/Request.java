package com.project.Agency;

import jakarta.persistence.*;
import lombok.Setter;
import lombok.Getter;

@Entity
public class Request {
    @Id
    @Getter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @ManyToOne
    private User executor; // Виконавець, який подав запит

    @Getter
    @Setter
    @ManyToOne
    private Order order; // Замовлення, на яке подано запит

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private Status status; // Статус запиту (PENDING, APPROVED, REJECTED)

    @Getter
    @Setter
    private String note; // Примітка від виконавця

    @Getter
    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }
}

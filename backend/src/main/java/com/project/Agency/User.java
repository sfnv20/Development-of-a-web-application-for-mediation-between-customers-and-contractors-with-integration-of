package com.project.Agency;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public String getEmail() {
        return email;
    }

    @Setter
    @Getter
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String password;

    @Enumerated(EnumType.STRING) // Зберігаємо ENUM як текст у базі даних
    @Column(nullable = false)
    private UserType type; // CLIENT або EXECUTOR

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> clientOrders = new ArrayList<>();

    @OneToMany(mappedBy = "executor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> executorOrders = new ArrayList<>();

}

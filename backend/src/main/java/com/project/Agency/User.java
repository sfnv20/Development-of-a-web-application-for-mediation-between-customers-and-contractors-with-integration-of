package com.project.Agency;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users") // Явно вказуємо назву таблиці
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false) // Відповідає колонці full_name
    private String fullName;

    @Column(name = "email", nullable = false, unique = true) // Відповідає колонці email
    private String email;

    @Column(name = "password", nullable = false) // Відповідає колонці password
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false) // Відповідає колонці role
    private Role role = Role.UNCONFIRMED;

    public enum Role {
        UNCONFIRMED,
        CLIENT,
        EXECUTOR,
        ADMIN
    }
}

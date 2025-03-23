package com.project.Agency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email); // Метод для пошуку користувача за email
    List<User> findByIsApprovedFalse();
    Optional<User> findByEmailAndIsApprovedTrue(String email); // Пошук підтвердженого користувача за email
}

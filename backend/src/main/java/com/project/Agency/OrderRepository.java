package com.project.Agency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByClient(User client); // Замовлення за клієнтом

    List<Order> findByExecutor(User executor); // Замовлення за виконавцем
}

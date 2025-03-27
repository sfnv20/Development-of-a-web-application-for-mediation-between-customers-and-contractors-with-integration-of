package com.project.Agency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByClientId(Long clientId); // Замовлення за клієнтом

    List<Order> findByExecutorId(Long executorId); // Замовлення за виконавцем
}

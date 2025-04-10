package com.project.Agency;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByClientId(Long clientId);

    List<Order> findByExecutorId(Long executorId);

    List<Order> findByExecutorIdAndStatus(Long executorId, Order.Status status);

    boolean existsByClientIdAndStatus(Long clientId, Order.Status status);
}

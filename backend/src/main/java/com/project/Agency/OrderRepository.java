package com.project.Agency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByClientId(Long clientId);

    List<Order> findByExecutorId(Long executorId);

    List<Order> findByExecutorIdAndStatus(Long executorId, Order.Status status);

    boolean existsByClientIdAndStatus(Long clientId, Order.Status status);

    List<Order> findByStatus(Order.Status status);

    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING'")
    List<Order> findPendingOrders();

    @Query("SELECT o FROM Order o WHERE o.executor.id = :executorId")
    List<Order> findOrdersByExecutor(@Param("executorId") Long executorId);

    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.status = :status WHERE o.id = :orderId")
    void updateOrderStatus(@Param("orderId") Long orderId, @Param("status") Order.Status status);
    // Отримати завершені замовлення клієнта
    @Query("SELECT o FROM Order o WHERE o.client.id = :clientId AND o.status = 'FINISHED'")
    List<Order> findFinishedOrdersByClient(@Param("clientId") Long clientId);

    // Отримати завершені замовлення виконавця
    @Query("SELECT o FROM Order o WHERE o.executor.id = :executorId AND o.status = 'FINISHED'")
    List<Order> findFinishedOrdersByExecutor(@Param("executorId") Long executorId);

    // Отримати всі завершені замовлення (для адміністратора)
    @Query("SELECT o FROM Order o WHERE o.status = 'FINISHED'")
    List<Order> findAllFinishedOrders();
}

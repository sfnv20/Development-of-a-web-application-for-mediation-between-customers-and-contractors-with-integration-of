package com.project.Agency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByOrderId(Long orderId);
    List<Request> findByStatus(Request.Status status);

    @Modifying
    @Transactional
    @Query("DELETE FROM Request r WHERE r.order.id = :orderId")
    void deleteByOrderId(Long orderId);
}

package com.project.Agency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByOrderId(Long orderId);
    List<Request> findByStatus(Request.Status status);
}

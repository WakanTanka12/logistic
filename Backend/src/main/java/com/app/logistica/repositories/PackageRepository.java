package com.app.logistica.repositories;

import com.app.logistica.entities.Delivery;
import com.app.logistica.entities.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {
    List<Package> findByOrderId(Long orderId);

}

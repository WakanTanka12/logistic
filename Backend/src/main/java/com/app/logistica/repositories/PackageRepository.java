package com.app.logistica.repositories;

import com.app.logistica.entities.Package;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PackageRepository extends JpaRepository<Package, Long> {
    List<Package> findByOrder_Id(Long orderId);
}

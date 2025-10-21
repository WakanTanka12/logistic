package com.app.logistica.repositories;

import com.app.logistica.entities.Delivery;
import com.app.logistica.entities.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByDeliveryId(Long deliveryId);

}

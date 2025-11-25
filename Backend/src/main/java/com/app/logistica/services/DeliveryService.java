package com.app.logistica.services;

import com.app.logistica.dtos.delivery.DeliveryRequest;

import java.util.List;

public interface DeliveryService {
    // 🔹 Listar todos los deliveries
    List<DeliveryRequest> listAll();

    // 🔹 Listar deliveries por conductor
    List<DeliveryRequest> listByDriver(Long driverId);

    // 🔹 Agregar delivery a un conductor
    DeliveryRequest addToDriver(Long driverId, DeliveryRequest dto);

    // 🔹 Obtener delivery por ID
    DeliveryRequest getById(Long deliveryId);

    // ===============================================================
// 🔹 Update delivery (by driver and delivery ID)
// ===============================================================
    DeliveryRequest update(Long deliveryId, DeliveryRequest dto);

    // 🔹 Eliminar delivery de un conductor
    void remove(Long deliveryId, Long driverId);

    // 🔹 Eliminar delivery por ID directo
    void deleteById(Long driverId);


}

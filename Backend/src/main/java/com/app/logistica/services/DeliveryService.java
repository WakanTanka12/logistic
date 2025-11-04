package com.app.logistica.services;

import com.app.logistica.dtos.DeliveryDTO;

import java.util.List;

public interface DeliveryService {
    // 🔹 Listar todos los deliveries
    List<DeliveryDTO> listAll();

    // 🔹 Listar deliveries por conductor
    List<DeliveryDTO> listByDriver(Long driverId);

    // 🔹 Agregar delivery a un conductor
    DeliveryDTO addToDriver(Long driverId, DeliveryDTO dto);

    // 🔹 Obtener delivery por ID
    DeliveryDTO getById(Long deliveryId);

    // ===============================================================
// 🔹 Update delivery (by driver and delivery ID)
// ===============================================================
    DeliveryDTO update(Long deliveryId, DeliveryDTO dto);

    // 🔹 Eliminar delivery de un conductor
    void remove(Long deliveryId, Long driverId);

    // 🔹 Eliminar delivery por ID directo
    void deleteById(Long driverId);


}

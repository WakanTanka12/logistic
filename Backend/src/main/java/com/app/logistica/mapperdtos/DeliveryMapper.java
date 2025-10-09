package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.DeliveryDTO;
import com.app.logistica.entities.Delivery;

public class DeliveryMapper {
    public static DeliveryDTO mapDeliveryToDeliveryDTO(Delivery delivery) {
        return new DeliveryDTO (
                delivery.getId(),
                delivery.getDeliveryDate(),
                delivery.getStatus()
        );
    }
    public static Delivery mapDeliveryDTOToDelivery(DeliveryDTO deliveryDTO) {
        return new Delivery (
                deliveryDTO.getId(),
                deliveryDTO.getDeliveryDate(),
                deliveryDTO.getStatus()
        );
    }
}

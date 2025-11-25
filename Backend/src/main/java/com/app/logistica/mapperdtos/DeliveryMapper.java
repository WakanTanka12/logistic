package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.delivery.DeliveryRequest;
import com.app.logistica.entities.Delivery;

public interface DeliveryMapper {
       public static DeliveryRequest toDTO(Delivery d) {
           if (d == null) return null;

           DeliveryRequest dto = new DeliveryRequest();
           dto.setId(d.getId());
           dto.setDeliveryDate(d.getDeliveryDate());
           dto.setStatus(d.getStatus());

           // 🔹 Incluye datos del conductor (nombre y ID)
           if (d.getDriver() != null) {
               dto.setDriverId(d.getDriver().getId());
           }
           if (d.getRoute() != null) {
               dto.setRouteId(d.getRoute().getId());
           }
           if (d.getOrder() != null) {
               dto.setOrderId(d.getOrder().getId());
           }
           return dto;
       }

       public static Delivery toEntity(DeliveryRequest dto) {
           if (dto == null) return null;

           Delivery d = new Delivery();
           d.setId(dto.getId());
           d.setDeliveryDate(dto.getDeliveryDate());
           d.setStatus(dto.getStatus());

           return d;
       }


}

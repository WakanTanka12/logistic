package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.DeliveryDTO;
import com.app.logistica.dtos.DriverDTO;
import com.app.logistica.entities.Delivery;
import com.app.logistica.entities.Driver;


import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

   public class DeliveryMapper {
       public static DeliveryDTO toDTO(Delivery d) {
           if (d == null) return null;

           DeliveryDTO dto = new DeliveryDTO();
           dto.setId(d.getId());
           dto.setDeliveryDate(d.getDeliveryDate());
           dto.setStatus(d.getStatus());

           // 🔹 Incluye datos del conductor (nombre y ID)
           if (d.getDriver() != null) {
               dto.setDriverId(d.getDriver().getId());
               dto.setDriverFullName(
                       d.getDriver().getFirstName() + " " + d.getDriver().getLastName()
               );
           }

           return dto;
       }

       public static Delivery toEntity(DeliveryDTO dto) {
           if (dto == null) return null;

           Delivery d = new Delivery();
           d.setId(dto.getId());
           d.setDeliveryDate(dto.getDeliveryDate());
           d.setStatus(dto.getStatus());

           return d;
       }


}

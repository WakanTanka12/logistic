package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.DeliveryDTO;
import com.app.logistica.dtos.DriverDTO;
import com.app.logistica.entities.Driver;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class DriverMapper {
    public static DriverDTO mapDriverToDriverDTO(Driver driver) {
        if (driver == null) return null;

// --- Deliveries -> DTOs
        List<DeliveryDTO> deliveryDTOs = null;
        if (driver.getDeliveries() != null) {
            deliveryDTOs = driver.getDeliveries()
                    .stream()
                    .map(DeliveryMapper::toDTO)
                    .collect(Collectors.toList());
        }

        DriverDTO dto = new DriverDTO();
        dto.setId(driver.getId());
        dto.setFirstName(driver.getFirstName());
        dto.setLastName(driver.getLastName());
        dto.setFree(driver.getFree());


        dto.setDeliveries(deliveryDTOs);

        return dto;

    }
    public static Driver mapDriverDTOToDriver(DriverDTO driverDTO) {
        if (driverDTO == null) return null;

        Driver d = new Driver();
        d.setId(driverDTO.getId());
        d.setFirstName(driverDTO.getFirstName());
        d.setLastName(driverDTO.getLastName());
        d.setFree(driverDTO.getFree());

// Deliveries -> Entities (bidirectional)
        if (driverDTO.getDeliveries() != null) {
            driverDTO.getDeliveries().stream()
                    .filter(Objects::nonNull)
                    .map(DeliveryMapper::toEntity)
                    .forEach(d::addDelivery);
        }

        return d;

    }
}

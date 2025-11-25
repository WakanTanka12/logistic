package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.delivery.DeliveryRequest;
import com.app.logistica.dtos.driver.DriverRequest;
import com.app.logistica.entities.Driver;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public interface DriverMapper {
    public static DriverRequest mapDriverToDriverDTO(Driver driver) {
        if (driver == null) return null;

// --- Deliveries -> DTOs
        List<DeliveryRequest> deliveryRequests = null;
        if (driver.getDeliveries() != null) {
            deliveryRequests = driver.getDeliveries()
                    .stream()
                    .map(DeliveryMapper::toDTO)
                    .collect(Collectors.toList());
        }

        DriverRequest dto = new DriverRequest();
        dto.setId(driver.getId());
        dto.setFirstName(driver.getFirstName());
        dto.setLastName(driver.getLastName());

        dto.setDeliveries(deliveryRequests);

        return dto;

    }
    public static Driver mapDriverDTOToDriver(DriverRequest driverRequest) {
        if (driverRequest == null) return null;

        Driver d = new Driver();
        d.setId(driverRequest.getId());
        d.setFirstName(driverRequest.getFirstName());
        d.setLastName(driverRequest.getLastName());

// Deliveries -> Entities (bidirectional)
        if (driverRequest.getDeliveries() != null) {
            driverRequest.getDeliveries().stream()
                    .filter(Objects::nonNull)
                    .map(DeliveryMapper::toEntity)
                    .forEach(d::addDelivery);
        }

        return d;

    }
}

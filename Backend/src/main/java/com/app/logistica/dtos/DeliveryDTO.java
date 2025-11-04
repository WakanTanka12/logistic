package com.app.logistica.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DeliveryDTO {
    private Long id;
    private LocalDate deliveryDate;
    private String status;

    private Long orderId;
    private Long driverId;
    private Long routeId;

}

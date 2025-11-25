package com.app.logistica.dtos.delivery;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DeliveryResponse {
    private Long id;
    private LocalDate deliveryDate;
    private String status;
    private Long orderId;
    private Long driverId;
    private Long routeId;
}

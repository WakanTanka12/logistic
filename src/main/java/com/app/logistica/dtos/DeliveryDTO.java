package com.app.logistica.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DeliveryDTO {
    private Long id;
    private LocalDate deliveryDate;
    private String status;
}

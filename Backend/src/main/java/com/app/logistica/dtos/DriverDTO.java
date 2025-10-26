package com.app.logistica.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DriverDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private Boolean free;
    private List<DeliveryDTO> deliveries;


    public LocalDate getDeliveryDate() {
    }

    public String getStatus() {
    }
}

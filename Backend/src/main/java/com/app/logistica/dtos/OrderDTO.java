package com.app.logistica.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class OrderDTO {
    private Long id;
    private LocalDate orderDate;
    private BigDecimal price;
    private String details;

    private Long customerId;

    public void setPackages(List<PackageDTO> collect) {
    }
}

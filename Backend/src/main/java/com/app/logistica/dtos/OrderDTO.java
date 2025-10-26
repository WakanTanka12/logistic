package com.app.logistica.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class OrderDTO {
    private Long id;
    private LocalDate orderDate;
    private BigDecimal price;
    private String details;

    private Long customerId;
    private String customerFullName;


}

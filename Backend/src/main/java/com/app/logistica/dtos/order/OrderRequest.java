package com.app.logistica.dtos.order;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class OrderRequest {
    private LocalDate orderDate;
    @Min(1)
    private BigDecimal price;
    @NotNull
    private String details;

    @NotNull(message = "Client Id is necessary")
    private Long customerId;

    @NotEmpty(message = "The Order needs to have at least one package")
    private List<Long> packageIds;
}

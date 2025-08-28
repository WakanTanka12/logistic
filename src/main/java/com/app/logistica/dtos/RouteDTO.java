package com.app.logistica.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Duration;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RouteDTO {
    private Long id;
    private String routeName;
    private String origin;
    private String destination;
    private BigDecimal distance;
    private Duration estimatedDuration;
}

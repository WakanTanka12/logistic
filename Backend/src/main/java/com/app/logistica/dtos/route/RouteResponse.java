package com.app.logistica.dtos.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class RouteResponse {
    private Long id;
    private String routeName;
    private String origin;
    private String destination;
    private BigDecimal distance;
    private Duration estimatedDuration;
    private List<Long> deliveryIds;
}

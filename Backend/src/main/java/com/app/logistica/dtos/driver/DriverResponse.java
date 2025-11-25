package com.app.logistica.dtos.driver;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DriverResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private List<Long> deliveryIds;
}

package com.app.logistica.dtos.driver;

import com.app.logistica.dtos.delivery.DeliveryRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class DriverRequest {
    private String firstName;
    private String lastName;
}

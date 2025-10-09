package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.DriverDTO;
import com.app.logistica.entities.Driver;

public class DriverMapper {
    public static DriverDTO mapDriverToDriverDTO(Driver driver) {
        return new DriverDTO(
                driver.getId(),
                driver.getFirstName(),
                driver.getLastName(),
                driver.getFree()
        );
    }
    public static Driver mapDriverDTOToDriver(DriverDTO driverDTO) {
        return new Driver(
                driverDTO.getId(),
                driverDTO.getFirstName(),
                driverDTO.getLastName(),
                driverDTO.getFree()
        );
    }
}

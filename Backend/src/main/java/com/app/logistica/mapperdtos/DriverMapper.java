package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.DriverDTO;
import com.app.logistica.entities.Driver;

public class DriverMapper {
    public static DriverDTO mapDriverToDriverDTO(Driver driver) {
        DriverDTO driverDTO = new DriverDTO();
        driverDTO.setId(driver.getId());
        driverDTO.setFirstName(driver.getFirstName());
        driverDTO.setLastName(driver.getLastName());
        driverDTO.setFree(driver.getFree());
        return driverDTO;
    }
    public static Driver mapDriverDTOToDriver(DriverDTO driverDTO) {
        Driver driver = new Driver();
        driver.setId(driverDTO.getId());
        driver.setFirstName(driverDTO.getFirstName());
        driver.setLastName(driverDTO.getLastName());
        driver.setFree(driverDTO.getFree());
        return driver;

    }
}

package com.app.logistica.services;

import com.app.logistica.dtos.DeliveryDTO;
import com.app.logistica.dtos.DriverDTO;
import com.app.logistica.entities.Driver;

import java.util.List;

public interface DriverService {
    DriverDTO createDriver(DriverDTO driverDTO);
    DriverDTO updateDriver(Long driverID, DriverDTO driverDTO);
    String deleteDriver(Long driverID);
    DriverDTO getDriver(Long driverID);
    List<DriverDTO> getDrivers();

}

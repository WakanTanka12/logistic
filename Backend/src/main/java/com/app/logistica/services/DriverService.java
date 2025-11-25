package com.app.logistica.services;

import com.app.logistica.dtos.driver.DriverRequest;

import java.util.List;

public interface DriverService {
    DriverRequest createDriver(DriverRequest driverRequest);
    DriverRequest updateDriver(Long driverID, DriverRequest driverRequest);
    String deleteDriver(Long driverID);
    DriverRequest getDriver(Long driverID);
    List<DriverRequest> getDrivers();

}

package com.app.logistica.controllers;


import com.app.logistica.dtos.driver.DriverRequest;
import com.app.logistica.exceptions.ResourceNotFoundException;
import com.app.logistica.services.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*") // permite llamadas desde el frontend (Vite)
@RequiredArgsConstructor
public class DriverController {
    private final DriverService driverService;
    @PostMapping
    public ResponseEntity<DriverRequest> createDriver(@RequestBody DriverRequest driverRequest) {
        DriverRequest savedDriverRequest = driverService.createDriver(driverRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDriverRequest);
    }

    /**
     * 🔹 Get all drivers
     * GET: /api/drivers
     */
    @GetMapping
    public ResponseEntity<List<DriverRequest>> getAllDrivers() {
        List<DriverRequest> drivers = driverService.getDrivers();
        return ResponseEntity.ok(drivers);
    }

    /**
     * 🔹 Get a single driver by ID
     * GET: /api/drivers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<DriverRequest> getDriverById(@PathVariable Long id) {
        DriverRequest driverRequest = driverService.getDriver(id);
        return ResponseEntity.ok(driverRequest);
    }

    /**
     * 🔹 Update an existing driver
     * PUT: /api/drivers/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<DriverRequest> updateDriver(
            @PathVariable Long id,
            @RequestBody DriverRequest driverRequest
    )
    {
        DriverRequest updatedDriver = driverService.updateDriver(id, driverRequest);
        return ResponseEntity.ok(updatedDriver);
    }

    /**
     * 🔹 Delete a driver by ID
     * DELETE: /api/drivers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDriver(@PathVariable Long id) {
        driverService.deleteDriver(id);
        return ResponseEntity.ok("Driver deleted successfully.");
    }

    /**
     * ⚠️ Optional: Global handling of ResourceNotFoundException (nice frontend errors)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }




}

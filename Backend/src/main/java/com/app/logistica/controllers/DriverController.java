package com.app.logistica.controllers;


import com.app.logistica.dtos.DriverDTO;
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
    public ResponseEntity<DriverDTO> createDriver(@RequestBody DriverDTO driverDTO) {
        DriverDTO savedDriverDTO = driverService.createDriver(driverDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDriverDTO);
    }

    /**
     * 🔹 Get all drivers
     * GET: /api/drivers
     */
    @GetMapping
    public ResponseEntity<List<DriverDTO>> getAllDrivers() {
        List<DriverDTO> drivers = driverService.getDrivers();
        return ResponseEntity.ok(drivers);
    }

    /**
     * 🔹 Get a single driver by ID
     * GET: /api/drivers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<DriverDTO> getDriverById(@PathVariable Long id) {
        DriverDTO driverDTO = driverService.getDriver(id);
        return ResponseEntity.ok(driverDTO);
    }

    /**
     * 🔹 Update an existing driver
     * PUT: /api/drivers/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<DriverDTO> updateDriver(
            @PathVariable Long id,
            @RequestBody DriverDTO driverDTO
    )
    {
        DriverDTO updatedDriver = driverService.updateDriver(id, driverDTO);
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

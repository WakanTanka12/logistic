package com.app.logistica.controllers;

import com.app.logistica.dtos.Package.PackageRequest;
import com.app.logistica.exceptions.ResourceNotFoundException;
import com.app.logistica.services.PackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PackageController {

    private final PackageService packageService;

    // 🔹 Crear package dentro de una Order
    @PostMapping("/orders/{orderId}/packages")
    public ResponseEntity<PackageRequest> createForOrder(
            @PathVariable Long orderId,
            @RequestBody PackageRequest dto
    ) {
        PackageRequest saved = packageService.createForOrder(orderId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 🔹 Listar packages de una Order
    @GetMapping("/orders/{orderId}/packages")
    public ResponseEntity<List<PackageRequest>> getByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(packageService.getByOrder(orderId));
    }

    // 🔹 CRUD general de packages
    @GetMapping("/packages")
    public ResponseEntity<List<PackageRequest>> getAll() {
        return ResponseEntity.ok(packageService.getPackages());
    }

    @GetMapping("/packages/{id}")
    public ResponseEntity<PackageRequest> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(packageService.getPackage(id));
    }

    @PutMapping("/packages/{id}")
    public ResponseEntity<PackageRequest> update(
            @PathVariable Long id,
            @RequestBody PackageRequest dto
    ) {
        return ResponseEntity.ok(packageService.updatePackage(id, dto));
    }

    @DeleteMapping("/packages/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        packageService.deletePackage(id);
        return ResponseEntity.ok("Package deleted successfully.");
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}

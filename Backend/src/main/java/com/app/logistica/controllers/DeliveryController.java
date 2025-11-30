package com.app.logistica.controllers;

import com.app.logistica.dtos.delivery.DeliveryRequest;
import com.app.logistica.dtos.delivery.DeliveryResponse; // ✅ Importar Response
import com.app.logistica.services.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    // Listar todos los deliveries
    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryResponse>> listAll() {
        return ResponseEntity.ok(deliveryService.listAll());
    }

    // Listar deliveries de un conductor específico
    @GetMapping("/drivers/{driverId}/deliveries")
    public ResponseEntity<List<DeliveryResponse>> listByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(deliveryService.listByDriver(driverId));
    }

    // Crear un delivery asignado a un conductor
    @PostMapping("/drivers/{driverId}/deliveries")
    public ResponseEntity<DeliveryResponse> addToDriver(@PathVariable Long driverId, @RequestBody DeliveryRequest dto) {
        return new ResponseEntity<>(deliveryService.addToDriver(driverId, dto), HttpStatus.CREATED);
    }

    // Obtener un delivery por ID
    @GetMapping("/deliveries/{id}")
    public ResponseEntity<DeliveryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getById(id));
    }

    // Actualizar un delivery
    @PutMapping("/deliveries/{id}")
    public ResponseEntity<DeliveryResponse> update(@PathVariable Long id, @RequestBody DeliveryRequest dto) {
        return ResponseEntity.ok(deliveryService.update(id, dto));
    }

    // Borrar un delivery (Endpoint general)
    @DeleteMapping("/deliveries/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        deliveryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Borrar un delivery de un conductor específico (Endpoint anidado)
    @DeleteMapping("/drivers/{driverId}/deliveries/{deliveryId}")
    public ResponseEntity<Void> removeDeliveryFromDriver(@PathVariable Long driverId, @PathVariable Long deliveryId) {
        deliveryService.remove(deliveryId, driverId);
        return ResponseEntity.noContent().build();
    }
}
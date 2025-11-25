package com.app.logistica.controllers;


import com.app.logistica.dtos.delivery.DeliveryRequest;
import com.app.logistica.services.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
    @RestController
    @RequiredArgsConstructor
    @RequestMapping("/api")
    public class DeliveryController {

        private final DeliveryService deliveryService;

        // ============================================================
        // 🔹 LISTAR TODAS LAS ENTREGAS (para /api/deliveries)
        // ============================================================
        @GetMapping("/deliveries")
        public ResponseEntity<List<DeliveryRequest>> listAll() {
            List<DeliveryRequest> list = deliveryService.listByDriver(null);
            return ResponseEntity.ok(list);
        }

        // ============================================================
        // 🔹 LISTAR ENTREGAS DE UN CONDUCTOR (para /api/drivers/{driverId}/deliveries)
        // ============================================================
        @GetMapping("/drivers/{driverId}/deliveries")
        public ResponseEntity<List<DeliveryRequest>> listByDriver(@PathVariable Long driverId) {
            List<DeliveryRequest> list = deliveryService.listByDriver(driverId);
            return ResponseEntity.ok(list);
        }

        // ============================================================
        // 🔹 OBTENER UNA ENTREGA POR ID
        // ============================================================
        @GetMapping("/deliveries/{deliveryId}")
        public ResponseEntity<DeliveryRequest> getById(@PathVariable Long deliveryId) {
            DeliveryRequest dto = deliveryService.getById(deliveryId);
            return ResponseEntity.ok(dto);
        }

        // ============================================================
        // 🔹 AGREGAR UNA NUEVA ENTREGA
        // ============================================================
        @PostMapping("/deliveries")
        public ResponseEntity<DeliveryRequest> create(@RequestBody DeliveryRequest dto) {
            if (dto.getDriverId() == null) {
                return ResponseEntity.badRequest().build();
            }
            DeliveryRequest created = deliveryService.addToDriver(dto.getDriverId(), dto);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        }

        // ============================================================
        // 🔹 ACTUALIZAR UNA ENTREGA EXISTENTE
        // ============================================================
        @PutMapping("/deliveries/{deliveryId}")
        public ResponseEntity<DeliveryRequest> update(@PathVariable Long deliveryId, @RequestBody DeliveryRequest dto) {
            if (dto.getDriverId() == null) {
                return ResponseEntity.badRequest().build();
            }
            DeliveryRequest updated = deliveryService.update(deliveryId, dto);
            return ResponseEntity.ok(updated);
        }

        // ============================================================
        // 🔹 ELIMINAR UNA ENTREGA
        // ============================================================
        @DeleteMapping("/deliveries/{deliveryId}")
        public ResponseEntity<String> delete(@PathVariable Long deliveryId,
                                             @RequestParam(required = false) Long driverId) {
            if (driverId != null) {
                deliveryService.remove(driverId, deliveryId);
            } else {
                // fallback en caso de no pasar driverId
                deliveryService.deleteById(deliveryId);
            }
            return ResponseEntity.ok("Delivery deleted successfully!");
        }
    }



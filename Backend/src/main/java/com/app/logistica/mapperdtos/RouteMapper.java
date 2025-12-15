package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.route.RouteRequest;
import com.app.logistica.dtos.route.RouteResponse;
import com.app.logistica.entities.Route;

import java.util.Collections;
import java.util.stream.Collectors;

public interface RouteMapper {

    // ============================================================
    // 🔹 Entity → Response (lo que el frontend recibe)
    // ============================================================
    static RouteResponse toResponse(Route entity) {
        if (entity == null) return null;

        RouteResponse dto = new RouteResponse();
        dto.setId(entity.getId());
        dto.setRouteName(entity.getRouteName());
        dto.setOrigin(entity.getOrigin());
        dto.setDestination(entity.getDestination());

        // Lista de IDs de deliveries (Long)
        if (entity.getDeliveries() != null) {
            dto.setDeliveryIds(
                    entity.getDeliveries()
                            .stream()
                            .map(delivery -> delivery.getId())
                            .collect(Collectors.toList())
            );
        } else {
            dto.setDeliveryIds(Collections.emptyList());
        }

        return dto;
    }

    // ============================================================
    // 🔹 Request → Entity (cuando creas o editas)
    // ============================================================
    static Route toEntity(RouteRequest dto) {
        if (dto == null) return null;

        Route route = new Route();
        route.setRouteName(dto.getRouteName());
        route.setOrigin(dto.getOrigin());
        route.setDestination(dto.getDestination());
        // Los deliveries NO se asignan aquí
        // porque se asignan en el DeliveryService cuando se asocia

        return route;
    }
}

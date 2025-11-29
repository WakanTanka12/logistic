package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.route.RouteRequest;
import com.app.logistica.entities.Route;

import java.util.stream.Collectors;

public interface RouteMapper {

    public static RouteRequest toDTO(Route route) {
        if (route == null) return null;

        RouteRequest dto = new RouteRequest();
        dto.setId(route.getId());
        dto.setRouteName(route.getRouteName());
        dto.setOrigin(route.getOrigin());
        dto.setDestination(route.getDestination());
        dto.setDistance(route.getDistance());
        dto.setEstimatedDuration(route.getEstimatedDuration());

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

    public static Route toEntity(RouteRequest dto) {
        if (dto == null) return null;

        Route route = new Route();
        route.setId(dto.getId());
        route.setRouteName(dto.getRouteName());
        route.setOrigin(dto.getOrigin());
        route.setDestination(dto.getDestination());
        route.setDistance(dto.getDistance());
        route.setEstimatedDuration(dto.getEstimatedDuration());
        return route;
    }
}

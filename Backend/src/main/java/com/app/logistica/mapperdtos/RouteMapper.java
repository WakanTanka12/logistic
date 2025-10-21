package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.RouteDTO;

import com.app.logistica.entities.Route;

public class RouteMapper {
    public static RouteDTO mapRouteToRouteDTO(Route route) {
        return new RouteDTO(
                route.getId(),
               route.getRouteName(),
                route.getOrigin(),
                route.getDestination(),
                route.getDistance(),
                route.getEstimatedDuration()
        );
    }
    public static Route mapRouteDTOToRoute(RouteDTO routeDTO) {
        return new Route(
                routeDTO.getId(),
                routeDTO.getRouteName(),
                routeDTO.getOrigin(),
                routeDTO.getDestination(),
               routeDTO.getDistance(),
                routeDTO.getEstimatedDuration()
        );
    }
}

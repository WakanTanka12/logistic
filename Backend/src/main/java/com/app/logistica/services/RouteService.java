package com.app.logistica.services;

import com.app.logistica.dtos.route.RouteRequest;
import com.app.logistica.dtos.route.RouteResponse;

import java.util.List;

public interface RouteService {

    RouteResponse createRoute(RouteRequest dto);

    RouteResponse updateRoute(Long id, RouteRequest dto);

    RouteResponse getRoute(Long id);

    List<RouteResponse> getAllRoutes();

    String deleteRoute(Long id);
}

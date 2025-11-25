package com.app.logistica.services;


import com.app.logistica.dtos.route.RouteRequest;
import java.util.List;

public interface RouteService {

    RouteRequest createRoute(RouteRequest dto);

    RouteRequest updateRoute(Long id, RouteRequest dto);

    RouteRequest getRoute(Long id);

    List<RouteRequest> getAllRoutes();

    String deleteRoute(Long id);
}


package com.app.logistica.servicesimpls;

import com.app.logistica.dtos.route.RouteRequest;
import com.app.logistica.entities.Route;
import com.app.logistica.exceptions.ResourceNotFoundException;

import com.app.logistica.mapperdtos.RouteMapper;
import com.app.logistica.services.RouteService;


import com.app.logistica.repositories.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional

public class RouteServiceImpl implements RouteService {

        private final RouteRepository routeRepository;

    @Override
        public RouteRequest createRoute(RouteRequest dto) {
            Route route = RouteMapper.toEntity(dto);
            Route saved = routeRepository.save(route);
            return RouteMapper.toDTO(saved);
        }

        @Override
        public RouteRequest updateRoute(Long id, RouteRequest dto) {
            Route route = routeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found with id " + id));

            route.setRouteName(dto.getRouteName());
            route.setOrigin(dto.getOrigin());
            route.setDestination(dto.getDestination());
            route.setDistance(dto.getDistance());
            route.setEstimatedDuration(dto.getEstimatedDuration());

            Route updated = routeRepository.save(route);
            return RouteMapper.toDTO(updated);
        }

        @Override
        @Transactional(readOnly = true)
        public RouteRequest getRoute(Long id) {
            Route route = routeRepository.findByIdWithDeliveries(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found with id " + id));
            return RouteMapper.toDTO(route);
        }

        @Override
        @Transactional(readOnly = true)
        public List<RouteRequest> getAllRoutes() {
            return routeRepository.findAllWithDeliveries()
                    .stream()
                    .map(RouteMapper::toDTO)
                    .collect(Collectors.toList());
        }

        @Override
        public String deleteRoute(Long id) {
            Route route = routeRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found with id " + id));
            routeRepository.delete(route);
            return "Route deleted successfully.";
        }
    }



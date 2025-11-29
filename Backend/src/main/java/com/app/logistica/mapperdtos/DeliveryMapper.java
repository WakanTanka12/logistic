package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.delivery.DeliveryRequest;
import com.app.logistica.dtos.delivery.DeliveryResponse;
import com.app.logistica.entities.Delivery;
import com.app.logistica.repositories.DriverRepository;
import com.app.logistica.repositories.OrderRepository;
import com.app.logistica.repositories.RouteRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class DeliveryMapper {

    @Autowired
    protected OrderRepository orderRepository;

    @Autowired
    protected DriverRepository driverRepository;

    @Autowired
    protected RouteRepository routeRepository;

    // ✅ Entity -> Response (MapStruct lo hace automático extrayendo IDs)
    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "driver.id", target = "driverId")
    @Mapping(source = "route.id", target = "routeId")
    public abstract DeliveryResponse toResponse(Delivery entity);

    // ✅ Request -> Entity (Manual: necesitamos buscar los objetos en la BD)
    public Delivery toEntity(DeliveryRequest request) {
        if (request == null) {
            return null;
        }

        Delivery delivery = Delivery.builder()
                .deliveryDate(request.getDeliveryDate())
                .status(request.getStatus())
                .build();

        // 1. Buscar y asignar Order
        if (request.getOrderId() != null) {
            delivery.setOrder(orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order no encontrada con ID: " + request.getOrderId())));
        }

        // 2. Buscar y asignar Driver
        if (request.getDriverId() != null) {
            delivery.setDriver(driverRepository.findById(request.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Driver no encontrado con ID: " + request.getDriverId())));
        }

        // 3. Buscar y asignar Route
        if (request.getRouteId() != null) {
            delivery.setRoute(routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new RuntimeException("Route no encontrada con ID: " + request.getRouteId())));
        }

        return delivery;
    }
}
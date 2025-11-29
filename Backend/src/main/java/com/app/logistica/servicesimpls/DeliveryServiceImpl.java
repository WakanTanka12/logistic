package com.app.logistica.servicesimpls;

import com.app.logistica.dtos.delivery.DeliveryRequest;
import com.app.logistica.entities.Delivery;
import com.app.logistica.entities.Driver;
import com.app.logistica.entities.Order;
import com.app.logistica.entities.Route;
import com.app.logistica.exceptions.ResourceNotFoundException;
import com.app.logistica.mapperdtos.DeliveryMapper;
import com.app.logistica.repositories.DeliveryRepository;
import com.app.logistica.repositories.DriverRepository;
import com.app.logistica.repositories.OrderRepository;
import com.app.logistica.repositories.RouteRepository;
import com.app.logistica.services.DeliveryService;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DriverRepository driverRepository;
    private final OrderRepository orderRepository;
    private final RouteRepository routeRepository;


    @Override
    @Transactional(readOnly = true)
    public List<DeliveryRequest> listAll() {
        return deliveryRepository.findAll()
                .stream()
                .map(DeliveryMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ===============================================================
// 🔹 List deliveries by driver (para /api/drivers/{id}/deliveries)
// ===============================================================
    @Override
    @Transactional(readOnly = true)
    public List<DeliveryRequest> listByDriver(Long driverId) {
        // Si driverId es null, devuelve todos
        if (driverId == null) {
            return listAll();
        }

        verifyDriver(driverId);

        return deliveryRepository.findByDriverId(driverId)
                .stream()
                .map(DeliveryMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ===============================================================
// 🔹 Add delivery to driver
// ===============================================================
    @Override
    public DeliveryRequest addToDriver(Long driverId, DeliveryRequest dto) {
        Driver driver = verifyDriver(driverId);

        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + dto.getOrderId()));

        Route route = null;
        if (dto.getRouteId() != null) {
            route = routeRepository.findById(dto.getRouteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + dto.getRouteId()));
        }

        Delivery delivery = DeliveryMapper.toEntity(dto);

        delivery.setDriver(driver);
        delivery.setOrder(order);
        delivery.setRoute(route);

        Delivery saved = deliveryRepository.save(delivery);
        return DeliveryMapper.toResponse(saved);
    }

    // ===============================================================
// 🔹 Get delivery by ID
// ===============================================================
    @Override
    @Transactional(readOnly = true)
    public DeliveryRequest getById(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery no encontrado con id=" + deliveryId));
        return DeliveryMapper.toResponse(delivery);
    }
    // ===============================================================
// 🔹 Update delivery (by driver and delivery ID)
// ===============================================================
    @Override
    public DeliveryRequest update(Long deliveryId, DeliveryRequest dto) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery no encontrado con id=" + dto.getId()));

        delivery.setDeliveryDate(dto.getDeliveryDate());
        delivery.setStatus(dto.getStatus());

        //Actualizar Driver (si cambió)
        if(dto.getDriverId() != null && !dto.getDriverId().equals(delivery.getDriver().getId())) {
            Driver driver = verifyDriver(dto.getDriverId());
            delivery.setDriver(driver);
        } else {
            delivery.setDriver(null);
        }

        if (dto.getRouteId() != null) {
            if (delivery.getRoute() == null || !dto.getRouteId().equals(delivery.getRoute().getId())) {
                Route route = routeRepository.findById(dto.getRouteId())
                        .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + dto.getRouteId()));
                delivery.setRoute(route);
            }
        } else {
            delivery.setRoute(null);
        }

        Delivery updated = deliveryRepository.save(delivery);
        return DeliveryMapper.toResponse(updated);
    }




    // ===============================================================
// 🔹 Remove delivery (nested route)
// ===============================================================
    @Override
    public void remove(Long driverId, Long deliveryId) {
        Driver driver = verifyDriver(driverId);

        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery no encontrado con id=" + deliveryId));

        if (!delivery.getDriver().getId().equals(driver.getId())) {
            throw new IllegalArgumentException("La entrega no pertenece a este conductor.");
        }

        Order order = delivery.getOrder();

        if (order != null) {
            order.setDelivery(null);
        }
        delivery.setOrder(null);
        deliveryRepository.delete(delivery);
    }

    // ===============================================================
// 🔹 Delete delivery directly by ID (for /api/deliveries/{id})
// ===============================================================
    @Override
    public void deleteById(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery no encontrado con id=" + deliveryId));
        if (!deliveryRepository.existsById(deliveryId)) {
            throw new ResourceNotFoundException("Delivery no encontrado con id=" + deliveryId);
        }

        Order order = delivery.getOrder();
        if(order != null) {
            order.setDelivery(null);
        }
        delivery.setOrder(null);
        deliveryRepository.delete(delivery);
    }

    // ===============================================================
// 🔹 Helper method: verify driver existence
// ===============================================================
    private Driver verifyDriver(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver no encontrado con id=" + driverId));
    }

}

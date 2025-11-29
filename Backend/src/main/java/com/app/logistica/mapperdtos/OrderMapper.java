package com.app.logistica.mappers;

import com.app.logistica.dtos.order.OrderRequest;
import com.app.logistica.dtos.order.OrderResponse;
import com.app.logistica.entities.Customer;
import com.app.logistica.entities.Order;
import com.app.logistica.entities.Package;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderMapper {

    // ✅ DTO → Entity (para creación)
    default Order toEntity(OrderRequest dto) {
        if (dto == null) return null;

        Order entity = new Order();
        entity.setOrderDate(dto.getOrderDate());
        entity.setPrice(dto.getPrice());
        entity.setDetails(dto.getDetails());

        // Relación con Customer (solo por ID)
        if (dto.getCustomerId() != null) {
            Customer customer = new Customer();
            customer.setId(dto.getCustomerId());
            entity.setCustomer(customer);
        }

        // Los paquetes se asocian en el Service usando packageIds
        return entity;
    }

    // ✅ Entity → DTO (para lectura)
    default OrderResponse toResponse(Order entity) {
        if (entity == null) return null;

        OrderResponse dto = new OrderResponse();
        dto.setId(entity.getId());
        dto.setOrderDate(entity.getOrderDate());
        dto.setPrice(entity.getPrice());
        dto.setDetails(entity.getDetails());

        // Customer ID
        if (entity.getCustomer() != null) {
            dto.setCustomerId(entity.getCustomer().getId());
        }

        // Package IDs
        if (entity.getPackages() != null) {
            dto.setPackageIds(
                    entity.getPackages().stream()
                            .filter(Objects::nonNull)
                            .map(Package::getId)
                            .collect(Collectors.toList())
            );
        } else {
            dto.setPackageIds(new ArrayList<>());
        }

        return dto;
    }

    // ✅ Lista de entidades → Lista de DTOs
    default List<OrderResponse> toResponseList(List<Order> entities) {
        if (entities == null) return new ArrayList<>();
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ✅ Actualización parcial desde DTO → Entity
    default void updateEntityFromRequest(OrderRequest dto, Order entity) {
        if (dto == null || entity == null) return;

        if (dto.getOrderDate() != null) entity.setOrderDate(dto.getOrderDate());
        if (dto.getPrice() != null) entity.setPrice(dto.getPrice());
        if (dto.getDetails() != null && !dto.getDetails().isBlank()) entity.setDetails(dto.getDetails());

        if (dto.getCustomerId() != null) {
            Customer customer = new Customer();
            customer.setId(dto.getCustomerId());
            entity.setCustomer(customer);
        }
    }
}

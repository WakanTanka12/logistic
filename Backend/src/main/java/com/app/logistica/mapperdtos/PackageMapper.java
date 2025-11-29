package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.Package.PackageRequest;
import com.app.logistica.dtos.Package.PackageResponse;
import com.app.logistica.entities.Package;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public interface PackageMapper {

    // ============================================================
    // 🔹 Entity -> Response (para enviar al frontend)
    // ============================================================
    static PackageResponse toResponse(Package entity) {
        if (entity == null) return null;

        PackageResponse dto = new PackageResponse();

        // entity.getId() es Long → tu DTO usa float
        if (entity.getId() != null) dto.setId(entity.getId().floatValue());

        dto.setWeight(entity.getWeight());
        dto.setLength(entity.getLength());
        dto.setWidth(entity.getWidth());
        dto.setHeight(entity.getHeight());

        if (entity.getOrder() != null)
            dto.setOrderId(entity.getOrder().getId());

        return dto;
    }

    // ============================================================
    // 🔹 Request -> Entity (para crear/actualizar)
    // ============================================================
    static Package toEntity(PackageRequest dto) {
        if (dto == null) return null;

        Package entity = new Package();
        entity.setWeight(dto.getWeight());
        entity.setLength(dto.getLength());
        entity.setWidth(dto.getWidth());
        entity.setHeight(dto.getHeight());

        // ⚠️ Importante:
        // NO seteamos entity.setOrder(...) aquí
        // porque ese id viene del controller/service
        // y se debe buscar Order en el repositorio
        return entity;
    }

    // ============================================================
    // 🔹 Lista de entities -> lista de responses
    // ============================================================
    static List<PackageResponse> toResponseList(List<Package> entities) {
        if (entities == null) return new ArrayList<>();
        return entities.stream()
                .map(PackageMapper::toResponse)
                .collect(Collectors.toList());
    }
}

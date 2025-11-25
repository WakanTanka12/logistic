package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.Package.PackageRequest;
import com.app.logistica.dtos.embedded.DimensionsDTO;
import com.app.logistica.entities.Package;
import com.app.logistica.entities.embedded.Dimensions;

public interface PackageMapper {

    public static PackageRequest toDTO(Package p) {
        if (p == null) return null;

        Dimensions d = p.getDimensions();
        DimensionsDTO ddto = (d == null) ? null : new DimensionsDTO(
                d.getLength(), d.getWidth(), d.getHeight()
        );

        PackageRequest dto = new PackageRequest();
        dto.setId(p.getId());
        dto.setDimensions(ddto);
        dto.setWeight(p.getWeight());
        if (p.getOrder() != null) dto.setOrderId(p.getOrder().getId());
        return dto;
    }

    public static Package toEntity(PackageRequest dto) {
        if (dto == null) return null;

        DimensionsDTO ddto = dto.getDimensions();
        Dimensions dims = (ddto == null) ? null : new Dimensions(
                ddto.getLength(), ddto.getWidth(), ddto.getHeight()
        );

        Package p = new Package();
        p.setId(dto.getId());
        p.setDimensions(dims);
        p.setWeight(dto.getWeight());
        // el setOrder se hace en el service (al asociar a Order)
        return p;
    }
}

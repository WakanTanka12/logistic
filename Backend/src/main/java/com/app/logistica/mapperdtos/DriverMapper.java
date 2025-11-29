package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.driver.DriverRequest;
import com.app.logistica.dtos.driver.DriverResponse;
import com.app.logistica.entities.Delivery;
import com.app.logistica.entities.Driver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DriverMapper {

    // ✅ Entity -> Response (Convierte List<Delivery> a List<Long>)
    @Mapping(source = "deliveries", target = "deliveryIds")
    DriverResponse toResponse(Driver entity);

    // ✅ Request -> Entity (Simple, no hay relaciones complejas en el Request)
    Driver toEntity(DriverRequest request);

    // 💡 Método auxiliar que MapStruct usará automáticamente para la línea @Mapping de arriba
    default List<Long> mapDeliveriesToIds(List<Delivery> deliveries) {
        if (deliveries == null) {
            return new ArrayList<>();
        }
        return deliveries.stream()
                .map(Delivery::getId)
                .collect(Collectors.toList());
    }
}
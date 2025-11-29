package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.customer.CustomerRequest;
import com.app.logistica.dtos.customer.CustomerResponse;
import com.app.logistica.entities.Customer;
import com.app.logistica.entities.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerMapper {
        @Mapping(source = "orders", target = "orderIds")
        default CustomerResponse toResponse(Customer entity) {
            if (entity == null) return null;
            CustomerResponse response = new CustomerResponse();
            response.setId(entity.getId());
            response.setFirstName(entity.getFirstName());
            response.setLastName(entity.getLastName());
            response.setEmail(entity.getEmail());
            response.setPhone(entity.getPhone());
            response.setAddress(entity.getAddress());
            if(entity.getOrders() != null) {
                List<Long> orderIds = entity.getOrders().stream()
                        .map(Order::getId)
                        .toList();
                response.setOrderIds(orderIds);
            } else {
                response.setOrderIds(new ArrayList<>());
            }
            return response;
        }
    default Customer toEntity(CustomerRequest customerRequest) {
        if (customerRequest == null) return null;

        return Customer.builder()
                .firstName(customerRequest.getFirstName())
                .lastName(customerRequest.getLastName())
                .email(customerRequest.getEmail())
                .phone(customerRequest.getPhone())
                .address(customerRequest.getAddress())
                .build();
    }
}

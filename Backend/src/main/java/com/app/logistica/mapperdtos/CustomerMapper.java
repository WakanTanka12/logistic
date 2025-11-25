package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.customer.CustomerRequest;
import com.app.logistica.dtos.customer.CustomerResponse;
import com.app.logistica.entities.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerMapper {
    default CustomerResponse toResponse(Customer entity) {
        if (entity == null) return null;
        CustomerResponse response = new CustomerResponse();
        response.setId(entity.getId());
        response.setFirstName(entity.getFirstName());
        response.setLastName(entity.getLastName());
        response.setEmail(entity.getEmail());
        response.setPhone(entity.getPhone());
        response.setAddress(entity.getAddress());
    }
    public static Customer mapCustomerDTOToCustomer(CustomerRequest customerRequest) {
        return new Customer(
                customerRequest.getId(),
                customerRequest.getFirstName(),
                customerRequest.getLastName(),
                customerRequest.getEmail(),
                customerRequest.getPhone(),
                customerRequest.getAddress()
        );
    }
}

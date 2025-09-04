package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.CustomerDTO;
import com.app.logistica.entities.Customer;

public class CustomerMapper {
    public static CustomerDTO mapCustomerToCustomerDTO(Customer customer) {
        return new CustomerDTO(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress()
        );
    }
    public static Customer mapCustomerDTOToCustomer(CustomerDTO customerDTO) {
        return new Customer(
                customerDTO.getId(),
                customerDTO.getFirstName(),
                customerDTO.getLastName(),
                customerDTO.getEmail(),
                customerDTO.getPhone(),
                customerDTO.getAddress()
        );
//        Customer customer = new Customer();
//        customer.setId(customerDTO.getId());
//        customer.setFirstName(customerDTO.getFirstName());
//        customer.setLastName(customerDTO.getLastName());
//        customer.setEmail(customerDTO.getEmail());
//        return customer;

    }
}

package com.app.logistica.services;

import com.app.logistica.dtos.CustomerDTO;

import java.util.List;

public interface CustomerService {
    CustomerDTO createCustomer(CustomerDTO customerDTO);
    CustomerDTO updateCustomer(Long customerId, CustomerDTO customerDTO);
    String deleteCustomer(Long customerId);
    CustomerDTO getCustomer(Long customerId);
    List<CustomerDTO> getAllCustomers();
}

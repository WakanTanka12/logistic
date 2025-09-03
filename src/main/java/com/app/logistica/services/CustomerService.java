package com.app.logistica.services;

import com.app.logistica.dtos.CustomerDTO;

import java.util.List;

public interface CustomerService {
    CustomerDTO createCustomer(CustomerDTO customerDTO);
    CustomerDTO updateCustomer(Long customerId, CustomerDTO customerDTO);
    String deleteCustomer(CustomerDTO customerDTO);
    CustomerDTO getCustomer(Long customerId);
    List<CustomerDTO> getAllCustomers();
}

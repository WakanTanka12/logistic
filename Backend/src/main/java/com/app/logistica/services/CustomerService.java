package com.app.logistica.services;

import com.app.logistica.dtos.customer.CustomerRequest;

import java.util.List;

public interface CustomerService {
    CustomerRequest createCustomer(CustomerRequest customerRequest);
    CustomerRequest updateCustomer(Long customerId, CustomerRequest customerRequest);
    String deleteCustomer(Long customerId);
    CustomerRequest getCustomer(Long customerId);
    List<CustomerRequest> getAllCustomers();
}

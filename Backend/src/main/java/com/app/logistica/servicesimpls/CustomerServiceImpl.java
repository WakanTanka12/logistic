package com.app.logistica.servicesimpls;

import com.app.logistica.dtos.customer.CustomerRequest;
import com.app.logistica.entities.Customer;
import com.app.logistica.exceptions.ResourceNotFoundException;
import com.app.logistica.mapperdtos.CustomerMapper;
import com.app.logistica.repositories.CustomerRepository;
import com.app.logistica.services.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public CustomerRequest createCustomer(CustomerRequest customerRequest) {
        Customer customer = CustomerMapper.toEntity(customerRequest);

        Customer savedCustomer = customerRepository.save(customer);
        return CustomerMapper.toResponse(savedCustomer);
    }

    @Override
    public CustomerRequest updateCustomer(Long customerId, CustomerRequest customerRequest) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(
                () -> new ResourceNotFoundException("Customer not found with id " + customerId)
        );

        customer.setFirstName(customerRequest.getFirstName());
        customer.setLastName(customerRequest.getLastName());
        customer.setEmail(customerRequest.getEmail());
        customer.setPhone(customerRequest.getPhone());
        customer.setAddress(customerRequest.getAddress());
        Customer updatedCustomer = customerRepository.save(customer);
        return CustomerMapper.toResponse(updatedCustomer);
    }

    @Override
    public String deleteCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(
                () -> new ResourceNotFoundException("Customer not found with id " + customerId)
        );

        customerRepository.delete(customer);
        return "Customer has been deleted";
    }

    @Override
    public CustomerRequest getCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(
                () -> new ResourceNotFoundException("Customer not found with id " + customerId)
        );
        return CustomerMapper.toResponse(customer);
    }

    @Override
    public List<CustomerRequest> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream().map(
                (CustomerMapper::toResponse)).collect(Collectors.toList());
    }
}

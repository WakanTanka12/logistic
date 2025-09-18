package com.app.logistica.servicesimpls;

import com.app.logistica.dtos.CustomerDTO;
import com.app.logistica.entities.Customer;
import com.app.logistica.exceptions.ResourceNotFoundException;
import com.app.logistica.mapperdtos.CustomerMapper;
import com.app.logistica.repositories.CustomerRepository;
import com.app.logistica.services.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer = CustomerMapper.mapCustomerDTOToCustomer(customerDTO);

        Customer savedCustomer = customerRepository.save(customer);
        return CustomerMapper.mapCustomerToCustomerDTO(savedCustomer);
    }

    @Override
    public CustomerDTO updateCustomer(Long customerId, CustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(
                () -> new ResourceNotFoundException("Customer not found with id " + customerId)
        );

        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhone(customerDTO.getPhone());
        customer.setAddress(customerDTO.getAddress());
        customer.setAge(customerDTO.getAge());
        customer.setGender(customerDTO.getGender());
        Customer  updatedCustomer = customerRepository.save(customer);
        return CustomerMapper.mapCustomerToCustomerDTO(updatedCustomer);
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
    public CustomerDTO getCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(
                () -> new ResourceNotFoundException("Customer not found with id " + customerId)
        );
        return CustomerMapper.mapCustomerToCustomerDTO(customer);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream().map(
                (CustomerMapper::mapCustomerToCustomerDTO)).collect(Collectors.toList());
    }
}

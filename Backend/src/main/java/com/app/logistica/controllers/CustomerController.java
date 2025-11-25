package com.app.logistica.controllers;

import com.app.logistica.dtos.customer.CustomerRequest;
import com.app.logistica.services.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/customers")
@CrossOrigin("*")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @PostMapping
    public ResponseEntity<CustomerRequest> createCustomer(@RequestBody CustomerRequest customerRequest) {
        CustomerRequest savedCustomerRequest = customerService.createCustomer(customerRequest);
        return new  ResponseEntity<>(savedCustomerRequest, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CustomerRequest>> getAllCustomers() {
        List<CustomerRequest> customerRequests = customerService.getAllCustomers();
        return ResponseEntity.ok(customerRequests);
    }

    @GetMapping("{id}")
    public ResponseEntity<CustomerRequest> getCustomer(@PathVariable Long id) {
        CustomerRequest customerRequest = customerService.getCustomer(id);
        return ResponseEntity.ok(customerRequest);
    }

    @PutMapping("{id}")
    public ResponseEntity<CustomerRequest> updateCustomer(@RequestBody CustomerRequest customerRequest, @PathVariable Long id) {
        CustomerRequest savedCustomerRequest = customerService.updateCustomer(id, customerRequest);
        return ResponseEntity.ok(savedCustomerRequest);
    }


    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Customer deleted successfully!");
    }
}

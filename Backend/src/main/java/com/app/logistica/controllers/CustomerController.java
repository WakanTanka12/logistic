package com.app.logistica.controllers;

import com.app.logistica.dtos.CustomerDTO;
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
    public ResponseEntity<CustomerDTO> createCustomer(@RequestBody CustomerDTO customerDTO) {
        CustomerDTO savedCustomerDTO = customerService.createCustomer(customerDTO);
        return new  ResponseEntity<>(savedCustomerDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<CustomerDTO> customerDTOs = customerService.getAllCustomers();
        return ResponseEntity.ok(customerDTOs);
    }

    @GetMapping("{id}")
    public ResponseEntity<CustomerDTO> getCustomer(@PathVariable Long id) {
        CustomerDTO customerDTO = customerService.getCustomer(id);
        return ResponseEntity.ok(customerDTO);
    }

    @PutMapping("{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@RequestBody CustomerDTO customerDTO, @PathVariable Long id) {
        CustomerDTO savedCustomerDTO = customerService.updateCustomer(id, customerDTO);
        return ResponseEntity.ok(savedCustomerDTO);
    }


    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok("Customer deleted successfully!");
    }
}

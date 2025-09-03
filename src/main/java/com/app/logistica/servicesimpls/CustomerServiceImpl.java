package com.app.logistica.servicesimpls;

import com.app.logistica.repositories.CustomerRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor

public class CustomerServiceImpl {
    @Autowired
    private CustomerRepository customerRepository;

}

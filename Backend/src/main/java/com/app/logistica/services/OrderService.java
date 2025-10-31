package com.app.logistica.services;

import com.app.logistica.dtos.OrderDTO;
import java.util.List;

public interface OrderService {
    List<OrderDTO> listAll();
    List<OrderDTO> listByCustomer(Long customerId);
    OrderDTO addToCustomer(Long orderId, OrderDTO orderDTO);
    OrderDTO getById(Long orderId);
    OrderDTO update(Long customerId, OrderDTO orderDTO);
    void remove(Long customerId, Long orderId);
    void deleteById(Long orderId);
}

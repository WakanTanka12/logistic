package com.app.logistica.services;

import com.app.logistica.dtos.order.OrderRequest;
import java.util.List;

public interface OrderService {
    List<OrderRequest> listAll();
    List<OrderRequest> listByCustomer(Long customerId);
    OrderRequest createOrder(Long customerId, OrderRequest orderRequest);
    OrderRequest getById(Long orderId);
    OrderRequest update(Long orderId, OrderRequest orderRequest);
    void remove(Long customerId, Long orderId);
    void deleteById(Long orderId);
}

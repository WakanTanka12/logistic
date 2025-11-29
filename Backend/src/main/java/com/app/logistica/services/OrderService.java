package com.app.logistica.services;

import com.app.logistica.dtos.order.OrderRequest;
import com.app.logistica.dtos.order.OrderResponse;

import java.util.List;

public interface OrderService {

    List<OrderResponse> listAll();

    List<OrderResponse> listByCustomer(Long customerId);

    OrderResponse createOrder(Long customerId, OrderRequest request);

    OrderResponse getById(Long orderId);

    OrderResponse update(Long orderId, OrderRequest request);

    void remove(Long customerId, Long orderId);

    void deleteById(Long orderId);
}

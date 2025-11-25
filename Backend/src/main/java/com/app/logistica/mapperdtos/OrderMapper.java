package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.order.OrderRequest;
import com.app.logistica.entities.Customer;
import com.app.logistica.entities.Order;

import java.util.stream.Collectors;

public interface OrderMapper {

    public static OrderRequest mapOrderToOrderDTO(Order order) {
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setId(order.getId());
        orderRequest.setOrderDate(order.getOrderDate());
        orderRequest.setPrice(order.getPrice());
        orderRequest.setDetails(order.getDetails());
        orderRequest.setCustomerId(order.getCustomer().getId());

        // 👇 Añadimos lista de packages si existe
        if (order.getPackages() != null && !order.getPackages().isEmpty()) {
            orderRequest.setPackages(
                    order.getPackages()
                            .stream()
                            .map(PackageMapper::toDTO) // usa tu PackageMapper
                            .collect(Collectors.toList())
            );
        }

        return orderRequest;
    }

    public static Order mapOrderDTOtoOrder(OrderRequest orderRequest) {
        Customer customer = new Customer();
        customer.setId(orderRequest.getCustomerId());

        Order order = new Order();
        order.setId(orderRequest.getId());
        order.setOrderDate(orderRequest.getOrderDate());
        order.setPrice(orderRequest.getPrice());
        order.setDetails(orderRequest.getDetails());
        order.setCustomer(customer);


        return order;
    }
}

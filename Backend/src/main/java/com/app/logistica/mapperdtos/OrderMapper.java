package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.OrderDTO;
import com.app.logistica.entities.Order;

public class OrderMapper {
    public static OrderDTO mapOrderToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setOrderDate(order.getOrderDate());
        orderDTO.setDetails(order.getDetails());
        orderDTO.setPrice(order.getPrice());
        return orderDTO;
    }
    public static Order mapOrderDTOtoOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setId(orderDTO.getId());
        order.setOrderDate(orderDTO.getOrderDate());
        order.setDetails(orderDTO.getDetails());
        order.setPrice(orderDTO.getPrice());
        return order;

    }
}

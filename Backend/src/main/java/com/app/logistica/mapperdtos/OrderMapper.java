package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.OrderDTO;
import com.app.logistica.entities.Order;

public class OrderMapper {
    public static OrderDTO mapOrderToOrderDTO(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getOrderDate(),
                order.getPrice(),
                order.getDetails()
        );
    }
    public static Order mapOrderDTOtoOrder(OrderDTO orderDTO) {
        return new Order(
                orderDTO.getId(),
                orderDTO.getOrderDate(),
                orderDTO.getPrice(),
                orderDTO.getDetails()
        );
    }
}

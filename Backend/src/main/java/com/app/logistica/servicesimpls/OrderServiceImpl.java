package com.app.logistica.servicesimpls;

import com.app.logistica.dtos.order.OrderRequest;
import com.app.logistica.entities.Customer;
import com.app.logistica.entities.Order;
import com.app.logistica.exceptions.ResourceNotFoundException;
import com.app.logistica.repositories.CustomerRepository;
import com.app.logistica.repositories.OrderRepository;
import com.app.logistica.services.OrderService;
import com.app.logistica.mapperdtos.OrderMapper;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional

public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    @Override
    public List<OrderRequest> listAll() {
        return orderRepository.findAllWithCustomer()
                .stream()
                .map(OrderMapper::mapOrderToOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderRequest> listByCustomer(Long customerId) {
        if (customerId == null) {
            return listAll();
        }
        verifyCustomer(customerId);

        return orderRepository.findByCustomerId(customerId)
                .stream()
                .map(OrderMapper::mapOrderToOrderDTO)
                .collect(Collectors.toList());
    }
/*
    @Override
    public OrderDTO addToCustomer(Long customerId, OrderDTO orderDTO) {
        Customer customer = verifyCustomer(customerId);

        Order order = OrderMapper.mapOrderDTOtoOrder(orderDTO);
        order.setCustomer(customer);

        orderRepository.save(order);
        return OrderMapper.mapOrderToOrderDTO(order);
    }
    */
    @Override
    public OrderRequest createOrder(Long customerId, OrderRequest orderRequest) {
        // 1️⃣ Verificar que el cliente exista
        Customer customer = verifyCustomer(customerId);

        // 2️⃣ Mapear el DTO a la entidad
        Order order = OrderMapper.mapOrderDTOtoOrder(orderRequest);

        // 3️⃣ Asociar el cliente a la orden
        order.setCustomer(customer);

        // 5️⃣ Guardar y devolver el DTO
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.mapOrderToOrderDTO(savedOrder);
    }

    @Override
    public OrderRequest getById(Long orderId) {
        Order order = orderRepository.findById(orderId).
                orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return OrderMapper.mapOrderToOrderDTO(order);
    }

    @Override
    public OrderRequest update(Long orderId, OrderRequest orderRequest) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderRequest.getId()));

        order.setOrderDate(orderRequest.getOrderDate());
        order.setPrice(orderRequest.getPrice());
        order.setDetails(orderRequest.getDetails());

        if (orderRequest.getCustomerId() != null &&
                (order.getCustomer() == null || !orderRequest.getCustomerId().equals(order.getCustomer().getId()))) {
            Customer c = customerRepository.findById(orderRequest.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + orderRequest.getCustomerId()));
            order.setCustomer(c);
        }
        Order updatedOrder = orderRepository.save(order);
        return  OrderMapper.mapOrderToOrderDTO(orderRepository.save(updatedOrder));
    }

    @Override
    public void remove(Long customerId, Long orderId) {
        Customer customer = verifyCustomer(customerId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new IllegalArgumentException("Customer id not match");
        }

        orderRepository.delete(order);
    }

    @Override
    public void deleteById(Long orderId) {
        if(!orderRepository.existsById(orderId)) {
            throw new IllegalArgumentException("Order not found with id: " + orderId);
        }
        orderRepository.deleteById(orderId);
    }

    private Customer verifyCustomer(Long customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer no conecontrado con id=" + customerId));
    }
}

package com.app.logistica.servicesimpls;

import com.app.logistica.dtos.OrderDTO;
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
    public List<OrderDTO> listAll() {
        return orderRepository.findAllWithCustomer()
                .stream()
                .map(OrderMapper::mapOrderToOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> listByCustomer(Long customerId) {
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
    public OrderDTO createOrder(Long customerId, OrderDTO orderDTO) {
        // 1️⃣ Verificar que el cliente exista
        Customer customer = verifyCustomer(customerId);

        // 2️⃣ Mapear el DTO a la entidad
        Order order = OrderMapper.mapOrderDTOtoOrder(orderDTO);

        // 3️⃣ Asociar el cliente a la orden
        order.setCustomer(customer);

        // 5️⃣ Guardar y devolver el DTO
        Order savedOrder = orderRepository.save(order);
        return OrderMapper.mapOrderToOrderDTO(savedOrder);
    }

    @Override
    public OrderDTO getById(Long orderId) {
        Order order = orderRepository.findById(orderId).
                orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return OrderMapper.mapOrderToOrderDTO(order);
    }

    @Override
    public OrderDTO update(Long orderId, OrderDTO orderDTO) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderDTO.getId()));

        order.setOrderDate(orderDTO.getOrderDate());
        order.setPrice(orderDTO.getPrice());
        order.setDetails(orderDTO.getDetails());

        if (orderDTO.getCustomerId() != null &&
                (order.getCustomer() == null || !orderDTO.getCustomerId().equals(order.getCustomer().getId()))) {
            Customer c = customerRepository.findById(orderDTO.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + orderDTO.getCustomerId()));
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

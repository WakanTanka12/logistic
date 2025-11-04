package com.app.logistica.controllers;

import com.app.logistica.dtos.OrderDTO;
import com.app.logistica.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> listAll() {
        List<OrderDTO> list = orderService.listByCustomer(null);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/customers/{customerId}/orders")
    public ResponseEntity<List<OrderDTO>> listByCustomer(@PathVariable Long customerId) {
        List<OrderDTO> list = orderService.listByCustomer(customerId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderDTO> getById(@PathVariable Long orderId){
        OrderDTO orderDTO = orderService.getById(orderId);
        return ResponseEntity.ok(orderDTO);
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO){
        if(orderDTO.getCustomerId() == null){
            return ResponseEntity.badRequest().build();
        }
        OrderDTO created = orderService.createOrder(orderDTO.getCustomerId(), orderDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/orders/{orderId}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long orderId, @RequestBody OrderDTO orderDTO){
        if(orderDTO.getCustomerId() == null){
            return ResponseEntity.badRequest().build();
        }
        OrderDTO updated = orderService.update(orderId, orderDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long orderId, @RequestParam (required = false) Long customerId){
        if(customerId == null){
            orderService.remove(customerId, orderId);
        } else {
            orderService.deleteById(orderId);
        }
        return ResponseEntity.ok("Order deleted successfully");
    }
}

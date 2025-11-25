package com.app.logistica.controllers;

import com.app.logistica.dtos.order.OrderRequest;
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
    public ResponseEntity<List<OrderRequest>> listAll() {
        List<OrderRequest> list = orderService.listByCustomer(null);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/customers/{customerId}/orders")
    public ResponseEntity<List<OrderRequest>> listByCustomer(@PathVariable Long customerId) {
        List<OrderRequest> list = orderService.listByCustomer(customerId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderRequest> getById(@PathVariable Long orderId){
        OrderRequest orderRequest = orderService.getById(orderId);
        return ResponseEntity.ok(orderRequest);
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderRequest> createOrder(@RequestBody OrderRequest orderRequest){
        if(orderRequest.getCustomerId() == null){
            return ResponseEntity.badRequest().build();
        }
        OrderRequest created = orderService.createOrder(orderRequest.getCustomerId(), orderRequest);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/orders/{orderId}")
    public ResponseEntity<OrderRequest> updateOrder(@PathVariable Long orderId, @RequestBody OrderRequest orderRequest){
        if(orderRequest.getCustomerId() == null){
            return ResponseEntity.badRequest().build();
        }
        OrderRequest updated = orderService.update(orderId, orderRequest);
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

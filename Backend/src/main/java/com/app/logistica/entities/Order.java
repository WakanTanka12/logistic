package com.app.logistica.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
// @ManyToOne → Customer
// @OneToOne → Delivery
// @OneToMany → Package
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate orderDate;
    private BigDecimal price;
    private String details;
//  Order es Entidad dueña en la relacion Customer - ID, es decir que esta es
//  la que guarda la FK
   @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

//  Order es la entidad relacionada en la relacion Order - Delivery, es decir que
//  su FK esta guardada en la tabla deliveries
@OneToOne(mappedBy = "order")
 private Delivery delivery;

@OneToMany(mappedBy = "order")
  private List<Package> packages;


    public Order(Long id, LocalDate orderDate, BigDecimal price, String details) {
        this.id = id;
        this.orderDate = orderDate;
        this.price = price;
        this.details = details;

    }
}

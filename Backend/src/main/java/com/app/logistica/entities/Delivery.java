package com.app.logistica.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// @OneToOne → Order
// @ManyToOne → Driver
// @ManyToOne → Route
@Entity
@Table(name = "Deliveries")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

  @OneToOne(cascade = CascadeType.ALL)
   @JoinColumn(name = "order_id")
   private Order order;
//
    @ManyToOne
    @JoinColumn(name = "driver_id")
   private Driver driver;
//
   @ManyToOne
    @JoinColumn(name = "route_id")
  private Route route;

    private LocalDate deliveryDate;
    private String status;

    public Delivery(Long id, LocalDate deliveryDate, String status) {
        this.id = id;
        this.deliveryDate = deliveryDate;
        this.status = status;

    }
}

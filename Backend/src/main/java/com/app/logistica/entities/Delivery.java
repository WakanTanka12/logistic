package com.app.logistica.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Collection;

// SERGIO X POPPY
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
    @JoinColumn(name = "order_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_dependant_order"))
    @JsonManagedReference
    private Order order;

    @ManyToOne
    @JoinColumn(name = "driver_id",
            foreignKey = @ForeignKey(name = "fk_dependant_driver"))
    @JsonManagedReference
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "route_id",
            foreignKey = @ForeignKey(name = "fk_dependant_route"))
    @JsonManagedReference
    private Route route;

    private LocalDate deliveryDate;
    private String status;

    public Delivery(Long id, LocalDate deliveryDate, String status) {
        this.id = id;
        this.deliveryDate = deliveryDate;
        this.status = status;

    }



}

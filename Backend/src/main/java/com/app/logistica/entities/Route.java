package com.app.logistica.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

// @OneToMany → Delivery
@Entity
@Table(name = "Routes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Delivery> deliveries= new ArrayList<>();

    // --- Métodos auxiliares ---
    public void addDelivery(Delivery delivery) {
        deliveries.add(delivery);
        delivery.setRoute(this);
    }

    public void removeDelivery(Delivery delivery) {
        deliveries.remove(delivery);
        delivery.setRoute(null);
    }


    private String routeName;
    private String origin;
    private String destination;
}

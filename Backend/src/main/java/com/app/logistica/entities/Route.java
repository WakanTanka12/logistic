package com.app.logistica.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Duration;
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

//    @OneToMany(mappedBy = "route")
//    private List<Delivery> deliveries;

    private String routeName;
    private String origin;
    private String destination;
    private BigDecimal distance;
    private Duration estimatedDuration;
}

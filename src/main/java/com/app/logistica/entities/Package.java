package com.app.logistica.entities;

import com.app.logistica.entities.embedded.Dimensions;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Packages")
@Data
@AllArgsConstructor
@NoArgsConstructor
// @ManyToOne → Order
public class Package {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Embedded
    private Dimensions dimensions;

    private float weight;
}


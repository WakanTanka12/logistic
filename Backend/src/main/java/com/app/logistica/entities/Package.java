package com.app.logistica.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JoinColumn(name = "order_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_dependant_order_2"))
    @JsonManagedReference
     private Order order;

    private double weight;
    private double length;
    private double width;
    private double height;


}


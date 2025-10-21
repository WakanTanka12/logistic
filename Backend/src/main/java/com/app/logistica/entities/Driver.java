package com.app.logistica.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// @OneToMany → Delivery
@Entity
@Table(name = "Drivers")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "driver")
    private List<Delivery> deliveries;

    private String firstName;
    private String lastName;
    private Boolean free;


    public Driver(Long id, String firstName, String lastName, Boolean free) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.free = free;

    }
}

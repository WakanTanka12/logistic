package com.app.logistica.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
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

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Delivery> deliveries= new ArrayList<>();;

    public void addDelivery(Delivery delivery) {
        deliveries.add(delivery);
        delivery.setDriver(this);
    }

    public void removeDelivery(Delivery delivery) {
        deliveries.remove(delivery);
        delivery.setDriver(null);
    }



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

package com.app.logistica.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Customers")
@Data
@AllArgsConstructor
@NoArgsConstructor
// @OneToMany → Order
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private int age;
    private String gender;
//    @OneToMany(mappedBy = "customer")
//    private List<Order> orders;

    //Constructor para el CustomerMapper
//    public Customer(Long id, String firstName, String lastName, String email, String phone, String address) {
//        this.id = id;
//        this.firstName = firstName;
//        this.lastName = lastName;
//        this.email = email;
//        this.phone = phone;
//        this.address = address;
//    }
//
}

package com.app.logistica.entities.embedded;

import jakarta.persistence.Embeddable;

@Embeddable
public class Dimensions {
    private float length;
    private float width;
    private float height;
}

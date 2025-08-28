package com.app.logistica.dtos.embedded;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DimensionsDTO {
    private float length;
    private float width;
    private float height;

}

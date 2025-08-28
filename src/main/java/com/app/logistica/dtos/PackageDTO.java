package com.app.logistica.dtos;

import com.app.logistica.dtos.embedded.DimensionsDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class PackageDTO {
    private Long id;
    private DimensionsDTO dimensions;
    private float weight;
}

package com.app.logistica.dtos.Package;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class PackageRequest {
    private double weight;
    private double length;
    private double width;
    private double height;
}

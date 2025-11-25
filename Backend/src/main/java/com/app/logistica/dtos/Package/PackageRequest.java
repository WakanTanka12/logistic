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
    private float weight;
    private float length;
    private float width;
    private float height;
}

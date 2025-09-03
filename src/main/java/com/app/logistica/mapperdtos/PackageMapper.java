package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.PackageDTO;
import com.app.logistica.dtos.embedded.DimensionsDTO;
import com.app.logistica.entities.Package;
import com.app.logistica.entities.embedded.Dimensions;

public class PackageMapper {
    public static PackageDTO mapPackageToPackageDTO(Package p) {
        PackageDTO packageDTO = new PackageDTO();
        packageDTO.setId(p.getId());
        packageDTO.setWeight(p.getWeight());
        if (p.getDimensions() != null) {
            Dimensions dimensions = p.getDimensions();
            DimensionsDTO dimensionsDTO = new DimensionsDTO();
            dimensionsDTO.setHeight(dimensions.getHeight());
            dimensionsDTO.setWidth(dimensions.getWidth());
            dimensionsDTO.setLength(dimensions.getLength());
            packageDTO.setDimensions(dimensionsDTO);
        }
        return packageDTO;
    }

    public static Package mapPackageDTOToPackage(PackageDTO p) {
        Package packageDTO = new Package();
        packageDTO.setId(p.getId());
        packageDTO.setWeight(p.getWeight());
    }
}

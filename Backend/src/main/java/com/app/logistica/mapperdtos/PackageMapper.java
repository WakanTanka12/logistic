package com.app.logistica.mapperdtos;

import com.app.logistica.dtos.PackageDTO;
import com.app.logistica.dtos.embedded.DimensionsDTO;
import com.app.logistica.entities.Package;
import com.app.logistica.entities.embedded.Dimensions;

public class PackageMapper {
    public static PackageDTO mapPackageToPackageDTO(Package p) {
        DimensionsDTO dimensionsDTO = new DimensionsDTO(
                p.getDimensions().getLength(),
                p.getDimensions().getWidth(),
                p.getDimensions().getHeight()
        );
        return new PackageDTO(
                p.getId(),
                dimensionsDTO,
                p.getWeight()
        );
    }

    public static Package mapPackageDTOToPackage(PackageDTO packageDTO) {
        Dimensions dimensions = new Dimensions(
                packageDTO.getDimensions().getLength(),
                packageDTO.getDimensions().getWidth(),
                packageDTO.getDimensions().getHeight()
        );
        return new Package(
                packageDTO.getId(),
                dimensions,
                packageDTO.getWeight()
        );
    }
}

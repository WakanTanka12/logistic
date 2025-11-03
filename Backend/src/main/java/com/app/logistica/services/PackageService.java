package com.app.logistica.services;

import com.app.logistica.dtos.PackageDTO;

import java.util.List;

public interface PackageService {
    PackageDTO createForOrder(Long orderId, PackageDTO dto);
    PackageDTO updatePackage(Long packageId, PackageDTO dto);
    void deletePackage(Long packageId);

    PackageDTO getPackage(Long packageId);
    List<PackageDTO> getPackages();
    List<PackageDTO> getByOrder(Long orderId);
}

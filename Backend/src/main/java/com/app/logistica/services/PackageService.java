package com.app.logistica.services;

import com.app.logistica.dtos.Package.PackageRequest;

import java.util.List;

public interface PackageService {
    PackageRequest createForOrder(Long orderId, PackageRequest dto);
    PackageRequest updatePackage(Long packageId, PackageRequest dto);
    void deletePackage(Long packageId);

    PackageRequest getPackage(Long packageId);
    List<PackageRequest> getPackages();
    List<PackageRequest> getByOrder(Long orderId);
}

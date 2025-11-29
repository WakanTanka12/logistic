package com.app.logistica.services;

import com.app.logistica.dtos.Package.PackageRequest;
import com.app.logistica.dtos.Package.PackageResponse;

import java.util.List;

public interface PackageService {

    PackageResponse createForOrder(Long orderId, PackageRequest dto);

    PackageResponse updatePackage(Long packageId, PackageRequest dto);

    void deletePackage(Long packageId);

    PackageResponse getPackage(Long packageId);

    List<PackageResponse> getPackages();

    List<PackageResponse> getByOrder(Long orderId);
}

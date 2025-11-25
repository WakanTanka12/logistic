package com.app.logistica.servicesimpls;

import com.app.logistica.dtos.Package.PackageRequest;
import com.app.logistica.entities.Order;
import com.app.logistica.entities.Package;
import com.app.logistica.exceptions.ResourceNotFoundException;
import com.app.logistica.mapperdtos.PackageMapper;
import com.app.logistica.repositories.OrderRepository;
import com.app.logistica.repositories.PackageRepository;
import com.app.logistica.services.PackageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PackageServiceImpl implements PackageService {

    private final PackageRepository packageRepository;
    private final OrderRepository orderRepository;

    @Override
    public PackageRequest createForOrder(Long orderId, PackageRequest dto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + orderId));

        Package p = PackageMapper.toEntity(dto);
        // asociar
        p.setOrder(order);
        Package saved = packageRepository.save(p);
        return PackageMapper.toDTO(saved);
    }

    @Override
    public PackageRequest updatePackage(Long packageId, PackageRequest dto) {
        Package p = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id " + packageId));

        // actualizar campos editables
        if (dto.getDimensions() != null) {
            if (p.getDimensions() == null) {
                p.setDimensions(new com.app.logistica.entities.embedded.Dimensions(
                        dto.getDimensions().getLength(),
                        dto.getDimensions().getWidth(),
                        dto.getDimensions().getHeight()
                ));
            } else {
                p.getDimensions().setLength(dto.getDimensions().getLength());
                p.getDimensions().setWidth(dto.getDimensions().getWidth());
                p.getDimensions().setHeight(dto.getDimensions().getHeight());
            }
        }
        p.setWeight(dto.getWeight());

        Package updated = packageRepository.save(p);
        return PackageMapper.toDTO(updated);
    }

    @Override
    public void deletePackage(Long packageId) {
        Package p = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id " + packageId));
        packageRepository.delete(p);
    }

    @Override
    public PackageRequest getPackage(Long packageId) {
        Package p = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id " + packageId));
        return PackageMapper.toDTO(p);
    }

    @Override
    public List<PackageRequest> getPackages() {
        return packageRepository.findAll().stream()
                .map(PackageMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PackageRequest> getByOrder(Long orderId) {
        return packageRepository.findByOrder_Id(orderId).stream()
                .map(PackageMapper::toDTO)
                .collect(Collectors.toList());
    }
}

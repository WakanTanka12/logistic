package com.app.logistica.servicesimpls;

import com.app.logistica.dtos.DeliveryDTO;
import com.app.logistica.entities.Delivery;
import com.app.logistica.entities.Driver;
import com.app.logistica.exceptions.ResourceNotFoundException;
import com.app.logistica.mapperdtos.DeliveryMapper;
import com.app.logistica.repositories.DeliveryRepository;
import com.app.logistica.repositories.DriverRepository;
import com.app.logistica.services.DeliveryService;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DriverRepository driverRepository;


    @Override
    @Transactional(readOnly = true)
    public List<DeliveryDTO> listAll() {
        return deliveryRepository.findAll()
                .stream()
                .map(DeliveryMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ===============================================================
// 🔹 List deliveries by driver (para /api/drivers/{id}/deliveries)
// ===============================================================
    @Override
    @Transactional(readOnly = true)
    public List<DeliveryDTO> listByDriver(Long driverId) {
        // Si driverId es null, devuelve todos
        if (driverId == null) {
            return listAll();
        }

        verifyDriver(driverId);

        return deliveryRepository.findByDriverId(driverId)
                .stream()
                .map(DeliveryMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ===============================================================
// 🔹 Add delivery to driver
// ===============================================================
    @Override
    public DeliveryDTO addToDriver(Long driverId, DeliveryDTO dto) {
        Driver driver = verifyDriver(driverId);

        Delivery delivery = DeliveryMapper.toEntity(dto);
        delivery.setDriver(driver);

        Delivery saved = deliveryRepository.save(delivery);
        return DeliveryMapper.toDTO(saved);
    }

    // ===============================================================
// 🔹 Get delivery by ID
// ===============================================================
    @Override
    @Transactional(readOnly = true)
    public DeliveryDTO getById(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery no encontrado con id=" + deliveryId));
        return DeliveryMapper.toDTO(delivery);
    }
    // ===============================================================
// 🔹 Update delivery (by driver and delivery ID)
// ===============================================================
    @Override
    public DeliveryDTO update(Long driverId, Long deliveryId, DeliveryDTO dto) {
        Driver driver = verifyDriver(driverId);

        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery no encontrado con id=" + deliveryId));

        if (!delivery.getDriver().getId().equals(driver.getId())) {
            throw new IllegalArgumentException("La entrega no pertenece a este conductor.");
        }

        // Solo atributos de Delivery: deliveryDate y status
        delivery.setDeliveryDate(dto.getDeliveryDate());
        delivery.setStatus(dto.getStatus());

        Delivery updated = deliveryRepository.save(delivery);
        return DeliveryMapper.toDTO(updated);
    }




    // ===============================================================
// 🔹 Remove delivery (nested route)
// ===============================================================
    @Override
    public void remove(Long driverId, Long deliveryId) {
        Driver driver = verifyDriver(driverId);

        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery no encontrado con id=" + deliveryId));

        if (!delivery.getDriver().getId().equals(driver.getId())) {
            throw new IllegalArgumentException("La entrega no pertenece a este conductor.");
        }

        deliveryRepository.delete(delivery);
    }

    // ===============================================================
// 🔹 Delete delivery directly by ID (for /api/deliveries/{id})
// ===============================================================
    @Override
    public void deleteById(Long deliveryId) {
        if (!deliveryRepository.existsById(deliveryId)) {
            throw new ResourceNotFoundException("Delivery no encontrado con id=" + deliveryId);
        }
        deliveryRepository.deleteById(deliveryId);
    }

    // ===============================================================
// 🔹 Helper method: verify driver existence
// ===============================================================
    private Driver verifyDriver(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver no encontrado con id=" + driverId));
    }

}

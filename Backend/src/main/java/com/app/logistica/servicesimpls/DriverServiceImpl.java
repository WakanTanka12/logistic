package com.app.logistica.servicesimpls;

import com.app.logistica.dtos.DriverDTO;
import com.app.logistica.entities.Driver;
import com.app.logistica.exceptions.ResourceNotFoundException;
import com.app.logistica.mapperdtos.DeliveryMapper;
import com.app.logistica.mapperdtos.DriverMapper;
import com.app.logistica.repositories.DriverRepository;
import com.app.logistica.services.DriverService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DriverServiceImpl implements DriverService {
    private final DriverRepository driverRepository;

    @Override
    public DriverDTO createDriver(DriverDTO driverDTO) {
        Driver driver = DriverMapper.mapDriverDTOToDriver(driverDTO);
        Driver savedDriver = driverRepository.save(driver);



        return DriverMapper.mapDriverToDriverDTO(savedDriver);
    }

    @Override
    public DriverDTO updateDriver(Long driverID, DriverDTO driverDTO) {
        Driver driver = driverRepository.findById(driverID)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id " + driverID));

        driver.setFirstName(driverDTO.getFirstName());
        driver.setLastName(driverDTO.getLastName());
        driver.setFree(driverDTO.getFree());

// --- Limpia las entregas anteriores ---
        driver.getDeliveries().forEach(d -> d.setDriver(null));
        driver.getDeliveries().clear();

// --- Asigna las nuevas entregas ---
        if (driverDTO.getDeliveries() != null) {
            driverDTO.getDeliveries().forEach(deliveryDto ->
                    driver.addDelivery(DeliveryMapper.toEntity(deliveryDto))
            );
        }

        Driver updatedDriver = driverRepository.save(driver);
        return DriverMapper.mapDriverToDriverDTO(updatedDriver);

    }

    @Override
    public String deleteDriver(Long driverID) {
        Driver driver = driverRepository.findById(driverID)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id " + driverID));

        driverRepository.delete(driver);
        return "Driver has been deleted";

    }

    @Override
    public DriverDTO getDriver(Long driverID) {
        Driver driver = driverRepository.findById(driverID)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id " + driverID));

        return DriverMapper.mapDriverToDriverDTO(driver);

    }

    @Override
    public List<DriverDTO> getDrivers() {
        List<Driver> drivers = driverRepository.findAll();

// Ya no es necesario driver.getDeliveries().size(), Hibernate carga todo por @EntityGraph
        return drivers.stream()
                .map(DriverMapper::mapDriverToDriverDTO)
                .collect(Collectors.toList());

    }
}

package com.app.logistica.servicesimpls;

import com.app.logistica.dtos.driver.DriverRequest;
import com.app.logistica.dtos.driver.DriverResponse; // ✅ Importante
import com.app.logistica.entities.Driver;
import com.app.logistica.exceptions.ResourceNotFoundException;
import com.app.logistica.mapperdtos.DriverMapper;
import com.app.logistica.repositories.DriverRepository;
import com.app.logistica.services.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // ✅ Inyecta el Mapper y el Repository
@Transactional
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper; // ✅ Variable del Mapper inyectado

    @Override
    public DriverResponse createDriver(DriverRequest driverRequest) {
        // 1. Convertir DTO a Entidad
        Driver driver = driverMapper.toEntity(driverRequest);

        // 2. Guardar
        Driver savedDriver = driverRepository.save(driver);

        // 3. Convertir Entidad guardada a Response
        return driverMapper.toResponse(savedDriver);
    }

    @Override
    public DriverResponse updateDriver(Long driverID, DriverRequest driverRequest) {
        // 1. Buscar Driver existente
        Driver driver = driverRepository.findById(driverID)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id " + driverID));

        // 2. Actualizar campos (puedes agregar más campos si tu DTO tiene email, teléfono, etc.)
        driver.setFirstName(driverRequest.getFirstName());
        driver.setLastName(driverRequest.getLastName());

        // 3. Guardar cambios
        Driver updatedDriver = driverRepository.save(driver);

        // 4. Retornar Response
        return driverMapper.toResponse(updatedDriver);
    }

    @Override
    public String deleteDriver(Long driverID) {
        if (!driverRepository.existsById(driverID)) {
            throw new ResourceNotFoundException("Driver not found with id " + driverID);
        }
        // Nota: Si hay entregas (deliveries) asociadas, podrías necesitar desvincularlas
        // antes de borrar o tener configurado el Cascade Type en la entidad.
        driverRepository.deleteById(driverID);
        return "Driver has been deleted successfully";
    }

    @Override
    @Transactional(readOnly = true)
    public DriverResponse getDriver(Long driverID) {
        Driver driver = driverRepository.findById(driverID)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id " + driverID));

        // ✅ Uso de la instancia del mapper
        return driverMapper.toResponse(driver);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> getDrivers() {
        return driverRepository.findAll()
                .stream()
                // ✅ Uso de referencia a método de instancia
                .map(driverMapper::toResponse)
                .collect(Collectors.toList());
    }
}
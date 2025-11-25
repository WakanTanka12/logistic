package com.app.logistica.services;

import com.app.logistica.dtos.auth.*;

/**
 * AuthService
 * -----------------------------------------------------
 * ✔ Define las operaciones públicas del servicio de autenticación
 */
public interface AuthService {

    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse authenticate(AuthenticationRequest request);

    AuthenticationResponse createAdminUser(); // ✅ Añadido aquí
}

package com.app.logistica.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JwtAuthenticationFilter
 * -----------------------------------------------------
 * ✔ Intercepta todas las solicitudes HTTP
 * ✔ Extrae y valida el token JWT del encabezado Authorization
 * ✔ Autentica al usuario si el token es válido
 * ✔ Permite pasar la solicitud al siguiente filtro en la cadena
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;
        final String username;

        // 1. Si no hay token, continuar (Spring Security decidirá si rechaza o permite)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwt = authHeader.substring(7);

            // 2. Intentamos extraer el usuario. Si expiro, AQUÍ lanza la excepción
            username = jwtService.extractUsername(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

        } catch (Exception e) {
            // ⚠️ CLAVE DE LA SOLUCIÓN:
            // Si el token está vencido o malformado, NO lanzamos error ni respondemos 403 aquí.
            // Simplemente no autenticamos al usuario (SecurityContext queda vacío)
            // y dejamos que la petición siga su curso.
            logger.warn("Token inválido o expirado: " + e.getMessage());
        }

        // 3. Continuar con la cadena de filtros
        // Si era /register (publica), pasará. Si era /employees (privada), Spring devolverá 403.
        filterChain.doFilter(request, response);
    }
}

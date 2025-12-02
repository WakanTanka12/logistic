// src/api/routesApi.js
import api from "./api";

const BASE_URL = "/routes";

/**
 * 🔹 Obtener todas las rutas
 * GET /api/routes
 */
export const getAllRoutes = () => api.get(BASE_URL);

/**
 * 🔹 Obtener una ruta por ID
 * GET /api/routes/{id}
 */
export const getRouteById = (id) => api.get(`${BASE_URL}/${id}`);

/**
 * 🔹 Crear ruta
 * POST /api/routes
 */
export const createRoute = (route) => api.post(BASE_URL, route);

/**
 * 🔹 Actualizar ruta
 * PUT /api/routes/{id}
 */
export const updateRoute = (id, route) => api.put(`${BASE_URL}/${id}`, route);

/**
 * 🔹 Eliminar ruta
 * DELETE /api/routes/{id}
 */
export const deleteRoute = (id) => api.delete(`${BASE_URL}/${id}`);

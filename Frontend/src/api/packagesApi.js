// src/api/packagesApi.js
import api from "./api";

const PKG_URL = "/packages";
const ORD_URL = "/orders";

/**
 * 🔹 Obtener todos los packages
 * GET /api/packages
 */
export const getAllPackages = () => api.get(PKG_URL);

/**
 * 🔹 Obtener un package por ID
 * GET /api/packages/{id}
 */
export const getPackageById = (id) => api.get(`${PKG_URL}/${id}`);

/**
 * 🔹 Actualizar un package
 * PUT /api/packages/{id}
 */
export const updatePackage = (id, pkg) => api.put(`${PKG_URL}/${id}`, pkg);

/**
 * 🔹 Eliminar un package
 * DELETE /api/packages/{id}
 */
export const deletePackage = (id) => api.delete(`${PKG_URL}/${id}`);

/**
 * 🔹 Obtener packages de una orden
 * GET /api/orders/{orderId}/packages
 */
export const getPackagesByOrder = (orderId) =>
    api.get(`${ORD_URL}/${orderId}/packages`);

/**
 * 🔹 Crear package dentro de una orden
 * POST /api/orders/{orderId}/packages
 * body = PackageRequest { weight, length, width, height }
 */
export const createPackageForOrder = (orderId, pkg) =>
    api.post(`${ORD_URL}/${orderId}/packages`, pkg);

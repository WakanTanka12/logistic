import api from "./api";

const BASE_URL = "/deliveries";
const DRIVER_URL = "/drivers";

// =====================================================
// 🔹 Obtener todos los deliveries
// =====================================================
export const getAllDeliveries = () => api.get(`${BASE_URL}`);

// =====================================================
// 🔹 Obtener delivery por ID
// =====================================================
export const getDeliveryById = (id) => api.get(`${BASE_URL}/${id}`);

// =====================================================
// 🔹 Crear delivery ASIGNADO A UN DRIVER
//    POST /drivers/{driverId}/deliveries
// =====================================================
export const createDeliveryForDriver = (driverId, delivery) =>
    api.post(`${DRIVER_URL}/${driverId}/deliveries`, delivery);

// =====================================================
// 🔹 Actualizar delivery
// =====================================================
export const updateDelivery = (id, delivery) =>
    api.put(`${BASE_URL}/${id}`, delivery);

// =====================================================
// 🔹 Borrar delivery (general)
// =====================================================
export const deleteDelivery = (id) =>
    api.delete(`${BASE_URL}/${id}`);

// =====================================================
// 🔹 Obtener deliveries por driver
// =====================================================
export const getDeliveriesByDriver = (driverId) =>
    api.get(`${DRIVER_URL}/${driverId}/deliveries`);

// =====================================================
// 🔹 Eliminar delivery específico de un driver
// =====================================================
export const removeDeliveryFromDriver = (driverId, deliveryId) =>
    api.delete(`${DRIVER_URL}/${driverId}/deliveries/${deliveryId}`);

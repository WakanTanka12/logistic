// src/api/deliveriesApi.js
import api from "./api";

const BASE_URL = "/deliveries";
const DRIVER_URL = "/drivers";
const ROUTE_URL = "/routes";

// 🔹 Obtener todos los deliveries
export const getAllDeliveries = () => api.get(`${BASE_URL}`);

// 🔹 Obtener delivery por ID
export const getDeliveryById = (id) => api.get(`${BASE_URL}/${id}`);

// 🔹 Crear delivery ASIGNADO A UN DRIVER
//    POST /drivers/{driverId}/deliveries
export const createDeliveryForDriver = (driverId, delivery) =>
    api.post(`${DRIVER_URL}/${driverId}/deliveries`, delivery);

// 🔹 Alias cómodo para usar en la pantalla (usa delivery.driverId)
export const createDelivery = (delivery) => {
    if (!delivery.driverId) {
        throw new Error("delivery.driverId es obligatorio para crear la entrega");
    }
    return createDeliveryForDriver(delivery.driverId, delivery);
};

// 🔹 Actualizar delivery
export const updateDelivery = (id, delivery) =>
    api.put(`${BASE_URL}/${id}`, delivery);

// 🔹 Borrar delivery
export const deleteDelivery = (id) =>
    api.delete(`${BASE_URL}/${id}`);

// 🔹 Obtener deliveries por driver
export const getDeliveriesByDriver = (driverId) =>
    api.get(`${DRIVER_URL}/${driverId}/deliveries`);

// 🔹 Eliminar delivery específico de un driver
export const removeDeliveryFromDriver = (driverId, deliveryId) =>
    api.delete(`${DRIVER_URL}/${driverId}/deliveries/${deliveryId}`);

// 🔹 Obtener deliveries por ruta (para RoutesScreen)
export const getDeliveriesByRoute = (routeId) =>
    api.get(`${ROUTE_URL}/${routeId}/deliveries`);

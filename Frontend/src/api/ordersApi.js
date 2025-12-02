// src/api/ordersApi.js
import api from "./api";

const BASE_URL = "/orders";
const CUSTOMER_URL = "/customers";

/**
 * 🔹 Obtener todas las órdenes
 * GET /api/orders
 */
export const getAllOrders = () => api.get(BASE_URL);

/**
 * 🔹 Obtener una orden por ID
 * GET /api/orders/{id}
 */
export const getOrderById = (id) => api.get(`${BASE_URL}/${id}`);

/**
 * 🔹 Crear una nueva orden
 * POST /api/orders
 * body: { orderDate, price, details, customerId, packageIds[] }
 */
export const createOrder = (order) => api.post(BASE_URL, order);

/**
 * 🔹 Actualizar una orden existente
 * PUT /api/orders/{id}
 */
export const updateOrder = (id, order) => api.put(`${BASE_URL}/${id}`, order);

/**
 * 🔹 Eliminar una orden
 * DELETE /api/orders/{id}
 * (si quieres pasar customerId para validar relación:)
 *   deleteOrder(id, customerId)
 */
export const deleteOrder = (id, customerId) => {
    if (customerId) {
        // llama: DELETE /api/orders/{id}?customerId={customerId}
        return api.delete(`${BASE_URL}/${id}`, {
            params: { customerId },
        });
    }
    return api.delete(`${BASE_URL}/${id}`);
};

/**
 * 🔹 Obtener todas las órdenes de un cliente
 * GET /api/customers/{customerId}/orders
 */
export const getOrdersByCustomer = (customerId) =>
    api.get(`${CUSTOMER_URL}/${customerId}/orders`);

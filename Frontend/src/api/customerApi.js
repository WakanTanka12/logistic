import api from "./api";

const BASE_URL = "/customers"; // ya incluye /api en api.js

// GET: lista completa
export const getAllCustomers = () => api.get(`${BASE_URL}`);

// GET: customer por id
export const getCustomerById = (id) => api.get(`${BASE_URL}/${id}`);

// POST: crear
export const addCustomer = (customer) => api.post(`${BASE_URL}`, customer);

// PUT: actualizar
export const updateCustomer = (id, customer) =>
    api.put(`${BASE_URL}/${id}`, customer);

// DELETE: eliminar
export const deleteCustomer = (id) =>
    api.delete(`${BASE_URL}/${id}`);

// EXTRA: obtener órdenes de un cliente (si lo usas)
export const getOrdersByCustomer = (id) =>
    api.get(`${BASE_URL}/${id}/orders`);

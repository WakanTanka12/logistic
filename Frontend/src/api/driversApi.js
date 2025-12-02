import api from "./api";

const BASE_URL = "/drivers";

// =================================================
// 🔹 Obtener todos los drivers
// =================================================
export const getAllDrivers = () => api.get(BASE_URL);

// =================================================
// 🔹 Obtener driver por ID
// =================================================
export const getDriverById = (id) => api.get(`${BASE_URL}/${id}`);

// =================================================
// 🔹 Crear driver
// =================================================
export const createDriver = (driver) => api.post(BASE_URL, driver);

// =================================================
// 🔹 Actualizar driver
// =================================================
export const updateDriver = (id, driver) =>
    api.put(`${BASE_URL}/${id}`, driver);

// =================================================
// 🔹 Eliminar driver
// =================================================
export const deleteDriver = (id) => api.delete(`${BASE_URL}/${id}`);

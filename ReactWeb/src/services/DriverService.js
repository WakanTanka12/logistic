import api from "./api.js"

export const getAllDrivers = () => api.get("/drivers");
export const getDriverById = (id) => api.get(`/drivers/${id}`);
export const createDriver = (driver) => api.post("/drivers", driver);
export const updateDriver = (id, driver) => api.put(`/drivers/${id}`, driver);
export const deleteDriver = (id) => api.delete(`/drivers/${id}`);

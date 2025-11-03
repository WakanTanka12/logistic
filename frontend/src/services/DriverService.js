import axios from "axios";

const DRIVER_URL = "http://localhost:8080/api/drivers";

export const getAllDrivers = () => axios.get(DRIVER_URL);
export const getDriverById = (id) => axios.get(`${DRIVER_URL}/${id}`);
export const createDriver = (driver) => axios.post(DRIVER_URL, driver);
export const updateDriver = (id, driver) => axios.put(`${DRIVER_URL}/${id}`, driver);
export const deleteDriver = (id) => axios.delete(`${DRIVER_URL}/${id}`);

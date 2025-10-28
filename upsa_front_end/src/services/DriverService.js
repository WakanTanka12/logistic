import axios from "axios";

const API_URL = "http://localhost:9090/api/drivers";
const DELIVERY_URL = "http://localhost:9090/api/deliveries";




export const getAllDrivers = () => axios.get(API_URL);
export const getDriverById = (id) => axios.get(`${API_URL}/${id}`);
export const createDriver = (driver) => axios.post(API_URL, driver);
export const updateDriver = (id, driver) => axios.put(`${API_URL}/${id}`, driver);
export const deleteDriver = (id) => axios.delete(`${API_URL}/${id}`);

export const getDeliveriesByDriver = (id) => axios.get(`${DELIVERY_URL}/byDriver/${id}`);

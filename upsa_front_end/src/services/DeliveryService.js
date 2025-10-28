import axios from "axios";

const API_URL = "http://localhost:9090/api/deliveries";
const DRI_URL = "http://localhost:9090/api/drivers";

export const getAllDeliveries = () => axios.get(API_URL);
export const getDeliveryById = (id) => axios.get(`${API_URL}/${id}`);
export const createDelivery = (delivery) => axios.post(API_URL, delivery);
export const updateDelivery = (id, delivery) => axios.put(`${API_URL}/${id}`, delivery);
export const deleteDelivery = (id) => axios.delete(`${API_URL}/${id}`);

// Related data
export const getAllDrivers = () => axios.get(DRI_URL);
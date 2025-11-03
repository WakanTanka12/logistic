import axios from "axios";

const DELIVERY_URL = "http://localhost:8080/api/deliveries";

export const getAllDeliveries = () => axios.get(DELIVERY_URL);
export const getDeliveryById = (id) => axios.get(`${DELIVERY_URL}/${id}`);
export const createDelivery = (delivery) => axios.post(DELIVERY_URL, delivery);
export const updateDelivery = (id, delivery) => axios.put(`${DELIVERY_URL}/${id}`, delivery);
export const deleteDelivery = (id) => axios.delete(`${DELIVERY_URL}/${id}`);

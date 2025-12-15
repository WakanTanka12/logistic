import api from "./api";

const DELIVERY_URL = "/deliveries";
const DRIVER_URL = "/drivers";

export const getAllDeliveries = () => api.get(DELIVERY_URL);
export const getDeliveryById = (id) => api.get(`${DELIVERY_URL}/${id}`);
export const createDelivery = (delivery) =>
    api.post(
        `/drivers/${delivery.driverId}/deliveries`,
        delivery
    );

export const updateDelivery = (id, delivery) => api.put(`${DELIVERY_URL}/${id}`, delivery);
export const deleteDelivery = (id) => api.delete(`${DELIVERY_URL}/${id}`);
export const getDeliveriesByDriver = (driverId) =>
    api.get(`${DRIVER_URL}/${driverId}/deliveries`);
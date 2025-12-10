import api from "./api.js"

export const getAllPackages = () => api.get("/packages");
export const getPackageById = (id) => api.get(`/packages/${id}`);
export const createPackage = (pkg) => api.post("/packages", pkg); // uso general (no por order)
export const updatePackage = (id, pkg) => api.put(`/packages/${id}`, pkg);
export const deletePackage = (id) => api.delete(`/packages/${id}`);

// Por Order
export const getPackagesByOrder = (orderId) => api.get(`/orders/${orderId}/packages`);
export const createPackageForOrder = (orderId, pkg) => api.post(`/orders/${orderId}/packages`, pkg);

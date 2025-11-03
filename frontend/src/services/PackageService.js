import axios from "axios";

const PKG_URL = "http://localhost:8080/api/packages";
const ORD_URL = "http://localhost:8080/api/orders";

export const getAllPackages = () => axios.get(PKG_URL);
export const getPackageById = (id) => axios.get(`${PKG_URL}/${id}`);
export const createPackage = (pkg) => axios.post(PKG_URL, pkg); // uso general (no por order)
export const updatePackage = (id, pkg) => axios.put(`${PKG_URL}/${id}`, pkg);
export const deletePackage = (id) => axios.delete(`${PKG_URL}/${id}`);

// Por Order
export const getPackagesByOrder = (orderId) => axios.get(`${ORD_URL}/${orderId}/packages`);
export const createPackageForOrder = (orderId, pkg) => axios.post(`${ORD_URL}/${orderId}/packages`, pkg);

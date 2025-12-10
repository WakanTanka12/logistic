import api from "./api.js"

export const getAllRoutes = () => api.get("/routes");
export const getRouteById = (id) => api.get(`/routes/${id}`);
export const createRoute = (route) => api.post("/routes", route);
export const updateRoute = (id, route) => api.put(`/routes/${id}`, route);
export const deleteRoute = (id) => api.delete(`/routes/${id}`);

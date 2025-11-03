import axios from "axios";

const ROUTE_URL = "http://localhost:8080/api/routes";

export const getAllRoutes = () => axios.get(ROUTE_URL);
export const getRouteById = (id) => axios.get(`${ROUTE_URL}/${id}`);
export const createRoute = (route) => axios.post(ROUTE_URL, route);
export const updateRoute = (id, route) => axios.put(`${ROUTE_URL}/${id}`, route);
export const deleteRoute = (id) => axios.delete(`${ROUTE_URL}/${id}`);

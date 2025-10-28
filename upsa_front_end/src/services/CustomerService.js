import axios   from "axios";

const RESTAPI_BASE_URL = 'http://localhost:9090/api/customers';

//Acceder al API de listar todos los empleados
export const getAllCustomers =
    ()=> axios.get(RESTAPI_BASE_URL);

//Llamar al Back-End al API que elimina un empleado
export const deleteCustomers =
    (customerID) =>
        axios.delete(RESTAPI_BASE_URL+'/'+customerID);

//Llamar al API del Back-End que nos permita agregar un Empleado
export const addCustomers =
    (customer) => axios.post(RESTAPI_BASE_URL, customer);

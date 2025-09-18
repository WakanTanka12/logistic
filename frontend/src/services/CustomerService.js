import axios   from "axios";

const RESTAPI_BASE_URL = 'http://localhost:8080/api/customers';

//Acceder al API de listar todos los empleados
export const getAllCustomers =
    ()=> axios.get(RESTAPI_BASE_URL);

//Llamar al Back-End al API que elimina un empleado
export const deleteCustomer =
    (customerID) =>
        axios.delete(RESTAPI_BASE_URL+'/'+customerID);

//Llamar al API del Back-End que nos permita agregar un Empleado
export const addCustomer =
    (customer) => axios.post(RESTAPI_BASE_URL, customer);

//Llamar al API del Back-End que nos permita actualizar a un EMPLEADO
export const updateCustomer =
    (customerID,customer) =>
        axios.put(RESTAPI_BASE_URL+'/'+customerID,customer);

//Llamar al API que nos traiga un empleado
export const getCustomer =
    (customerID) => axios.get(RESTAPI_BASE_URL+'/'+customerID);

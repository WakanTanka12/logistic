import axios   from "axios";

const RESTAPI_BASE_URL = 'http://localhost:8080/api/invoices';

//Acceder al API de listar todos los empleados
export const getAllInvoices =
    ()=> axios.get(RESTAPI_BASE_URL);

//Llamar al Back-End al API que elimina un empleado
export const deleteInvoices =
    (invoiceID) =>
        axios.delete(RESTAPI_BASE_URL+'/'+invoiceID);

//Llamar al API del Back-End que nos permita agregar un Empleado
export const addInvoices =
    (invoice) => axios.post(RESTAPI_BASE_URL, invoice);

//Llamar al API del Back-End que nos permita actualizar a un EMPLEADO
export const updateInvoices =
    (invoiceID,invoice) =>
        axios.put(RESTAPI_BASE_URL+'/'+invoiceID,invoice);

//Llamar al API que nos traiga un empleado
export const getInvoice =
    (invoiceID) => axios.get(RESTAPI_BASE_URL+'/'+invoiceID);

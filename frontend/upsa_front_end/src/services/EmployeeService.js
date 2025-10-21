import axios   from "axios";

const RESTAPI_BASE_URL = 'http://localhost:8080/api/employees';

//Acceder al API de listar todos los empleados
export const getAllEmployees =
    ()=> axios.get(RESTAPI_BASE_URL);

//Llamar al Back-End al API que elimina un empleado
export const deleteEmployee =
    (employeeID) =>
        axios.delete(RESTAPI_BASE_URL+'/'+employeeID);

//Llamar al API del Back-End que nos permita agregar un Empleado
export const addEmployee =
    (employee) => axios.post(RESTAPI_BASE_URL, employee);

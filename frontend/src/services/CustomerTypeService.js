import axios from "axios";

const RESTAPI_BASE_URL = 'http://localhost:8080/api/customerTypes';

export const addCustomerType =
    (customerType) => axios.get(RESTAPI_BASE_URL, customerType);

export const getCustomerType =
    (customerTypeID) => axios.get(RESTAPI_BASE_URL+'/'+customerTypeID);

export const getAllCustomerTypes =
    ()=> axios.get(RESTAPI_BASE_URL);

export const updateCustomerType =
    (customerTypeID, customerType) =>
        axios.put(RESTAPI_BASE_URL+'/'+customerTypeID, customerType);

export const deleteCustomerType =
    (customerTypeID) => axios.delete(RESTAPI_BASE_URL+'/'+customerTypeID);
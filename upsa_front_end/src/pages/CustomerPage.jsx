import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerList from "../components/Customer/CustomerList";
import CustomerForm from "../components/Customer/CustomerForm";

/**
 * CustomerPage — Gestiona rutas internas:
 * /customers, /customers/add, /customers/edit/:id
 */
const CustomerPage = () => {
    return (
        <Routes>
            <Route index element={<CustomerList />} />
            <Route path="add" element={<CustomerForm />} />
            <Route path="edit/:id" element={<CustomerForm />} />
        </Routes>
    );
};

export default CustomerPage;

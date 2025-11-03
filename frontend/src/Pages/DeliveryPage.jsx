import React from "react";
import { Routes, Route } from "react-router-dom";
import DeliveryList from "../components/Delivery/DeliveryList";
import DeliveryForm from "../components/Delivery/DeliveryForm";

const DeliveryPage = () => (
    <Routes>
        <Route index element={<DeliveryList />} />
        <Route path="add" element={<DeliveryForm />} />
        <Route path="edit/:id" element={<DeliveryForm />} />
    </Routes>
);

export default DeliveryPage;

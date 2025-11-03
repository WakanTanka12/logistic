import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderList from "../components/Order/OrderList";
import OrderForm from "../components/Order/OrderForm";

const OrderPage = () => (
    <Routes>
        <Route index element={<OrderList />} />
        <Route path="add" element={<OrderForm />} />
        <Route path="edit/:id" element={<OrderForm />} />
    </Routes>
);

export default OrderPage;

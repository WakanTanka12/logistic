import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createOrder, updateOrder, getOrderById } from "../../services/OrderService";
import { getAllCustomers } from "../../services/CustomerService";

const OrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState({
        orderDate: "",
        price: "",
        details: "",
        customerId: "",
    });

    // 👇 aseguramos que sea array vacío
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadCustomers();
        if (id) loadOrder();
    }, [id]);

    const loadCustomers = async () => {
        try {
            const res = await getAllCustomers();
            console.log("Customers response:", res.data);

            // ✅ protección contra estructuras inesperadas
            const list = Array.isArray(res.data)
                ? res.data
                : res.data?.content || res.data?.data || [];

            setCustomers(list);
        } catch (error) {
            console.error("Error loading customers:", error);
            Swal.fire("Error", "Failed to load customers", "error");
        }
    };

    const loadOrder = async () => {
        try {
            const res = await getOrderById(id);
            const o = res.data;
            setOrder({
                orderDate: o.orderDate || "",
                price: o.price ?? "",
                details: o.details || "",
                customerId: o.customerId || "",
            });
        } catch (error) {
            console.error("Error loading order:", error);
            Swal.fire("Error", "Failed to load order data", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder({ ...order, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            orderDate: order.orderDate || null,
            price: order.price !== "" ? Number(order.price) : null,
            details: order.details,
            customerId: order.customerId ? Number(order.customerId) : null,
        };

        try {
            if (id) {
                await updateOrder(id, payload);
                Swal.fire("Updated", "Order updated successfully", "success");
            } else {
                await createOrder(payload);
                Swal.fire("Created", "Order created successfully", "success");
            }
            navigate("/orders");
        } catch (error) {
            console.error("Error saving order:", error);
            Swal.fire("Error", "Failed to save order", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit Order" : "Add Order"}</h2>
            <form onSubmit={handleSubmit}>
                {/* Order Date */}
                <div className="mb-3">
                    <label className="form-label" >Order Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="orderDate"
                        value={order.orderDate || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Price */}
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price"
                        value={order.price}
                        onChange={handleChange}
                    />
                </div>

                {/* Details */}
                <div className="mb-3">
                    <label className="form-label">Details</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        name="details"
                        value={order.details}
                        onChange={handleChange}
                    />
                </div>

                {/* Customer */}
                <div className="mb-3">
                    <label className="form-label">Customer</label>
                    <select
                        className="form-select"
                        name="customerId"
                        value={order.customerId || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Customer --</option>

                        {/* ✅ protección en el render */}
                        {Array.isArray(customers) &&
                            customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {`${c.firstName} ${c.lastName}`}
                                </option>
                            ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-success me-2">
                    Save
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/orders")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default OrderForm;

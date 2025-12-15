import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createOrder, updateOrder, getOrderById } from "../../services/OrderService";
import { getAllCustomers } from "../../services/CustomerService";

const getLocalDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const OrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState({
        orderDate: id ? "" : getLocalDateString(),
        price: "",
        details: "",
        customerId: "",
    });

    // Inicializamos errores vacíos
    const [errors, setErrors] = useState({
        orderDate: "",
        price: "",
        details: "",
        customerId: "",
    });

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadCustomers();
        if (id) loadOrder();
    }, [id]);

    function validateForm() {
        let valid = true;
        const copy = {
            orderDate: "",
            price: "",
            details: "",
            customerId: "",
        };

        // Validación Fecha
        if (!order.orderDate) {
            copy.orderDate = "Order Date is required";
            valid = false;
        }

        // Validación Precio
        if (!order.price) {
            copy.price = "Price is required";
            valid = false;
        } else if (Number(order.price) <= 0 || Number(order.price) > 1000) {
            copy.price = "Price must be greater than 0 and less than 1000";
            valid = false;
        }

        // Validación Cliente
        if (!order.customerId) {
            copy.customerId = "Customer is required";
            valid = false;
        }

        setErrors(copy);
        return valid;
    }

    const loadCustomers = async () => {
        try {
            const res = await getAllCustomers();
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
        if (!validateForm()) {
            Swal.fire({
                title: "Error",
                text: "Please correct the highlighted errors",
                icon: "error"
            });
            return;
        }
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

                {/* Price */}
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        className={`form-control ${errors.price ? "is-invalid" : ""}`}
                        name="price"
                        value={order.price}
                        onChange={handleChange}
                    />
                    {errors.price && (
                        <div className="invalid-feedback">{errors.price}</div>
                    )}
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
                        className={`form-select ${errors.customerId ? "is-invalid" : ""}`}
                        name="customerId"
                        value={order.customerId || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Customer --</option>
                        {Array.isArray(customers) &&
                            customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {`${c.firstName} ${c.lastName}`}
                                </option>
                            ))}
                    </select>
                    {errors.customerId && (
                        <div className="invalid-feedback">{errors.customerId}</div>
                    )}
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
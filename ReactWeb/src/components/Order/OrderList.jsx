import React, { useState, useEffect } from "react";
import { getAllOrders, deleteOrder } from "../../services/OrderService.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await getAllOrders();
            setOrders(response.data);
        } catch (error) {
            console.error("Error getting orders", error);
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Confirm delete",
            text: "Are you sure you want to delete this order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteOrder(id);
                    Swal.fire(
                        "Deleted!",
                        "Order removed successfully",
                        "success"
                    );
                    loadOrders();
                } catch (error) {
                    console.error("Error deleting order", error);
                    Swal.fire("Error", "Failed to delete order", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <h2>Order List</h2>
            <button
                className="btn btn-primary mb-3"
                onClick={() => navigate("/orders/add")}
            >
                Add Order
            </button>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Order Date</th>
                    <th>Price</th>
                    <th>Details</th>
                    <th>Customer ID</th> {/* 👈 cambiado */}
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.orderDate}</td>
                        <td>{order.price}</td>
                        <td>{order.details}</td>
                        {/* 👇 ahora usamos customerId */}
                        <td>{order.customerId ?? "-"}</td>
                        <td>
                            <button
                                onClick={() =>
                                    navigate(`/orders/edit/${order.id}`)
                                }
                                className="btn btn-warning btn-sm me-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(order.id)}
                                className="btn btn-danger btn-sm"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;

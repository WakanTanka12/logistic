import React, { useState, useEffect } from "react";
import { getAllOrders, deleteOrder } from "../../services/OrderService.js";
import { Link, useNavigate } from "react-router-dom"; // Importamos Link
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
            confirmButtonColor: "#d33", // Color rojo consistente
            cancelButtonColor: "#6c757d",
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
            {/* Cabecera Alineada (Consistente con DriverList) */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Order List</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/orders/add")}
                >
                    Add Order
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Order Date</th>
                    <th>Price</th>
                    <th>Details</th>
                    <th>Customer ID</th>
                    <th style={{ width: 160 }}>Actions</th> {/* Ancho fijo para acciones */}
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.price}</td>
                            <td>{order.details}</td>
                            <td>{order.customerId ?? "-"}</td>
                            <td>
                                {/* Usamos Link para editar, consistente con DriverList */}
                                <Link
                                    to={`/orders/edit/${order.id}`}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(order.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    // Estado vacío
                    <tr>
                        <td colSpan="6" className="text-center text-muted">
                            No orders found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
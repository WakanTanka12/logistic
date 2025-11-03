import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllDeliveries, deleteDelivery } from "../../services/DeliveryService";

const DeliveryList = () => {
    const [deliveries, setDeliveries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => { loadDeliveries(); }, []);

    const loadDeliveries = async () => {
        try {
            const res = await getAllDeliveries();
            setDeliveries(res.data);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load deliveries", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This delivery will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDelivery(id);
                    Swal.fire("Deleted!", "Delivery has been deleted.", "success");
                    loadDeliveries();
                } catch (e) {
                    console.error(e);
                    Swal.fire("Error", "Failed to delete delivery", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Delivery List</h2>
                <button className="btn btn-primary" onClick={() => navigate("/deliveries/add")}>
                    Add Delivery
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Delivery Date</th>
                    <th>Status</th>
                    <th>Order ID</th>
                    <th>Driver ID</th>
                    <th>Route ID</th>
                    <th style={{ width: 160 }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {deliveries.length ? deliveries.map((d) => (
                    <tr key={d.id}>
                        <td>{d.id}</td>
                        <td>{d.deliveryDate || "-"}</td>
                        <td>{d.status || "-"}</td>
                        <td>{d.orderId || "-"}</td>
                        <td>{d.driverId || "-"}</td>
                        <td>{d.routeId || "-"}</td>
                        <td>
                            <Link to={`/deliveries/edit/${d.id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>Delete</button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="7" className="text-center text-muted">No deliveries found.</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DeliveryList;

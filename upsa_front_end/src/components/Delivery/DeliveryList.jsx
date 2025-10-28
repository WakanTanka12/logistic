import React, { useEffect, useState } from "react";
import { getAllDeliveries, deleteDelivery } from "../../services/DeliveryService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DeliveryList = () => {
    const [deliveries, setDeliveries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDeliveries();
    }, []);

    const loadDeliveries = async () => {
        try {
            const res = await getAllDeliveries();
            setDeliveries(res.data || []);
        } catch (error) {
            console.error("Error loading deliveries:", error);
            Swal.fire("Error", "Failed to load deliveries", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Confirm Delete",
            text: "Are you sure you want to delete this delivery?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDelivery(id);
                    Swal.fire("Deleted!", "Delivery removed successfully", "success");
                    loadDeliveries();
                } catch (error) {
                    console.error("Error deleting delivery:", error);
                    Swal.fire("Error", "Failed to delete delivery", "error");
                }
            }
        });
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "-";
        // Si viene como 'YYYY-MM-DD' (LocalDate) lo mostramos tal cual o lo formateamos simple
        try {
            // Intento de formateo amigable; si falla, devuelve el string original
            const d = new Date(isoDate);
            if (isNaN(d.getTime())) return isoDate;
            return d.toLocaleDateString();
        } catch {
            return isoDate;
        }
    };

    return (
        <div className="container mt-4">
            <h2>Delivery List</h2>
            <button
                className="btn btn-primary mb-3"
                onClick={() => navigate("/deliveries/add")}
            >
                Add Delivery
            </button>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Delivery Date</th>
                    <th>Status</th>
                    <th style={{ width: 160 }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {deliveries.length > 0 ? (
                    deliveries.map((d) => (
                        <tr key={d.id}>
                            <td>{d.id}</td>
                            <td>{formatDate(d.deliveryDate)}</td>
                            <td>{d.status || "-"}</td>
                            <td>
                                <button
                                    onClick={() => navigate(`/deliveries/edit/${d.id}`)}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(d.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center text-muted">
                            No deliveries found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DeliveryList;

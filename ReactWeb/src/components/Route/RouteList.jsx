import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllRoutes, deleteRoute } from "../../services/RouteService";

const RouteList = () => {
    const [routes, setRoutes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => { loadRoutes(); }, []);

    const loadRoutes = async () => {
        try {
            const res = await getAllRoutes();
            setRoutes(res.data);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load routes", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This route will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteRoute(id);
                    Swal.fire("Deleted!", "Route has been deleted.", "success");
                    loadRoutes();
                } catch (e) {
                    console.error(e);
                    Swal.fire("Error", "Failed to delete route", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Route List</h2>
                <button className="btn btn-primary" onClick={() => navigate("/routes/add")}>
                    Add Route
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th style={{ width: 160 }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {routes.length ? routes.map((r) => (
                    <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.routeName}</td>
                        <td>{r.origin}</td>
                        <td>{r.destination}</td>
                        <td>
                            <Link to={`/routes/edit/${r.id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Delete</button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="7" className="text-center text-muted">No routes found.</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default RouteList;

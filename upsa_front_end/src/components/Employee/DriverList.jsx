import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllDrivers,
    deleteDriver,
} from "../../services/DriverService";

const DriverList = () => {
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();

    /** Load all drivers on mount */
    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            const res = await getAllDrivers();
            setDrivers(res.data);
        } catch (error) {
            console.error("Error loading drivers:", error);
            Swal.fire("Error", "Failed to load drivers", "error");
        }
    };

    /** Delete confirmation */
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This driver will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDriver(id);
                    Swal.fire("Deleted!", "Driver has been deleted.", "success");
                    loadDrivers();
                } catch (error) {
                    console.error("Error deleting driver:", error);
                    Swal.fire("Error", "Failed to delete driver", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Driver List</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/drivers/add")}
                >
                    Add Driver
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Free</th>
                    <th style={{ width: "160px" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {drivers.length > 0 ? (
                    drivers.map((d) => (
                        <tr key={d.id}>
                            <td>{d.id}</td>
                            <td>{d.firstName}</td>
                            <td>{d.lastName}</td>
                            <td>{d.free ? "Yes" : "No"}</td>
                            <td>
                                <Link
                                    to={`/drivers/edit/${d.id}`}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(d.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center text-muted">
                            No drivers found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DriverList;

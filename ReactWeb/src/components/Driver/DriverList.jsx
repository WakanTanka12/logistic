import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllDrivers, deleteDriver } from "../../services/DriverService";
import { getDeliveriesByDriver } from "../../services/DeliveryService";

const DriverList = () => {
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();
    const [deliveriesByDriver, setDeliveriesByDriver] = useState({});
    const [loadingDeliveries, setLoadingDeliveries] = useState(false);

    useEffect(() => { loadDrivers(); }, []);

    useEffect(() => {
        if (drivers.length > 0) {
            loadAllDeliveriesForDrivers(drivers);
        }
    }, [drivers]);

    const loadDrivers = async () => {
        try {
            const res = await getAllDrivers();
            setDrivers(res.data);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load drivers", "error");
        }
    };

    const loadAllDeliveriesForDrivers = async (driverList) => {
        setLoadingDeliveries(true);
        const deliveriesMap = {};
        const promises = driverList.map(async (driver) => {
            try {
                // Usar la nueva función del DeliveryService
                const res = await getDeliveriesByDriver(driver.id);
                deliveriesMap[driver.id] = res.data;
            } catch (e) {
                console.error(`Error loading deliveries for driver ${driver.id}:`, e);
                deliveriesMap[driver.id] = [];
            }
        });

        await Promise.all(promises);
        setDeliveriesByDriver(deliveriesMap);
        setLoadingDeliveries(false);
    };

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
                } catch (e) {
                    console.error(e);
                    Swal.fire("Error", "Failed to delete driver", "error");
                }
            }
        });
    };

    const renderDeliveries = (driverId) => {
        const deliveries = deliveriesByDriver[driverId];

        if (loadingDeliveries) {
            return <span className="text-muted">Loading...</span>;
        }

        if (!deliveries || deliveries.length === 0) {
            return <span className="text-muted">No assigned deliveries.</span>;
        }

        // Muestra una lista de las entregas
        return (
            <ul className="list-unstyled mb-0">
                {deliveries.map((d) => (
                    <li key={d.id}>
                        Delivery #{d.id} - Status: {d.status}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Driver List</h2>
                <button className="btn btn-primary" onClick={() => navigate("/drivers/add")}>
                    Add Driver
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Assigned Deliveries</th>
                    <th style={{ width: 160 }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {drivers.length ? drivers.map((d) => (
                    <tr key={d.id}>
                        <td>{d.id}</td>
                        <td>{d.firstName} {d.lastName}</td>
                        <td>
                            {renderDeliveries(d.id)}
                        </td>
                        <td>
                            <Link to={`/drivers/edit/${d.id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>Delete</button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="4" className="text-center text-muted">No drivers found.</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DriverList;

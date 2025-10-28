import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createDriver,
    updateDriver,
    getDriverById,
    getDeliveriesByDriver, // opcional: solo se usa cuando id existe
} from "../../services/DriverService";

const DriverForm = () => {
    const [driver, setDriver] = useState({
        firstName: "",
        lastName: "",
        free: true,
    });

    const [deliveries, setDeliveries] = useState([]); // solo lectura en modo edición
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadDriver();
            loadDriverDeliveries();
        }
    }, [id]);

    const loadDriver = async () => {
        try {
            const res = await getDriverById(id);
            const data = res.data;
            setDriver({
                firstName: data.firstName ?? "",
                lastName: data.lastName ?? "",
                free: typeof data.free === "boolean" ? data.free : true,
            });
        } catch (error) {
            console.error("Error loading driver:", error);
            Swal.fire("Error", "Failed to load driver data", "error");
        }
    };

    const loadDriverDeliveries = async () => {
        try {
            // Si tu API devuelve un array de deliveries del driver
            const res = await getDeliveriesByDriver(id);
            setDeliveries(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            // Si no tienes este endpoint, no es necesario mostrar nada.
            console.warn("No deliveries or endpoint not available:", error);
            setDeliveries([]);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDriver({
            ...driver,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            firstName: driver.firstName,
            lastName: driver.lastName,
            free: !!driver.free,
        };

        try {
            if (id) {
                await updateDriver(id, payload);
                Swal.fire("Updated", "Driver updated successfully", "success");
            } else {
                await createDriver(payload);
                Swal.fire("Created", "Driver created successfully", "success");
            }
            navigate("/drivers");
        } catch (error) {
            console.error("Error saving driver:", error);
            Swal.fire("Error", "Failed to save driver", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit Driver" : "Add Driver"}</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                {/* First Name */}
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={driver.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Last Name */}
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={driver.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Free (checkbox) */}
                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="freeCheckbox"
                        name="free"
                        checked={!!driver.free}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="freeCheckbox">
                        Free (available for new routes/deliveries)
                    </label>
                </div>

                {/* Buttons */}
                <button type="submit" className="btn btn-success me-2">
                    Save
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/drivers")}
                >
                    Cancel
                </button>
            </form>


        </div>
    );
};

export default DriverForm;

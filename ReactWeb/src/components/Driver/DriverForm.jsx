import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createDriver, updateDriver, getDriverById } from "../../services/DriverService";

const DriverForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [driver, setDriver] = useState({
        firstName: "",
        lastName: "",
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
    });

    useEffect(() => {
        if (id) loadDriver();
    }, [id]);

    function validateForm () {
        let valid = true;
        const copy = {
            firstName: "",
            lastName: "",
        };

        const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;

        if(!driver.firstName) {
            copy.firstName = "First Name is required";
            valid = false;
        } else if (!onlyLettersRegex.test(driver.firstName)) {
            copy.firstName = "First Name cannot have numbers";
            valid = false;
        }

        if(!driver.lastName) {
            copy.lastName = "Last Name is required";
            valid = false;
        } else if (!onlyLettersRegex.test(driver.lastName)) {
            copy.lastName = "Last Name cannot have numbers";
            valid = false;
        }

        setErrors(copy);
        return valid;
    }

    const loadDriver = async () => {
        try {
            const res = await getDriverById(id);
            const d = res.data;
            setDriver({
                firstName: d.firstName || "",
                lastName: d.lastName || "",
                free: d.free ?? true,
            });
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load driver", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDriver({ ...driver, [name]: type === "checkbox" ? checked : value });
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
            firstName: driver.firstName,
            lastName: driver.lastName,
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
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to save driver", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit Driver" : "Add Driver"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                        className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                        name="firstName"
                        value={driver.firstName}
                        onChange={handleChange}
                        required
                    />
                    {errors.firstName && (
                        <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                        name="lastName"
                        value={driver.lastName}
                        onChange={handleChange}
                        required
                    />
                    {errors.lastName && (
                        <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                </div>
                <button type="submit" className="btn btn-success me-2">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/drivers")}>Cancel</button>
            </form>
        </div>
    );
};

export default DriverForm;

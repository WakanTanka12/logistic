import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getPackageById,
    updatePackage,
    createPackageForOrder,
} from "../../services/PackageService";
import { getAllOrders } from "../../services/OrderService";

const PackageForm = () => {
    const { id, orderId } = useParams();
    const navigate = useNavigate();

    // 1. ESTADO PLANO (Igual que tu Backend)
    const [pkg, setPkg] = useState({
        weight: "",
        length: "",
        width: "",
        height: "",
        orderId: "",
    });
    const [errors, setErrors] = useState({
        weight: "",
        length: "",
        width:"",
        height: "",
        orderId: "",
    });

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!orderId) loadOrders();
        if (id) loadPackage();
    }, [id, orderId]);

    function validateForm() {
        let valid = true;
        const copy = {
            weight: "",
            length: "",
            width:"",
            height: "",
            orderId: "",
        };

        const numberOnlyRegex = /^\d+(\.\d+)?$/;

        if (!pkg.weight) {
            copy.weight = "Weight is required";
            valid = false;
        } else if (!numberOnlyRegex.test(pkg.weight)) {
            copy.weight = "Weight needs to be a number";
            valid = false;
        } else if (pkg.weight < 0 || pkg.weight > 100000) {
            copy.weight = "Weight needs to be greater than 0 and less than 100000";
            valid = false;
        }

        if (!pkg.length) {
            copy.length = "Length is required";
            valid = false;
        } else if (!numberOnlyRegex.test(pkg.length)) {
            copy.length = "Length needs to be a number";
            valid = false;
        } else if (pkg.length < 0 || pkg.length > 100000) {
            copy.length = "Length needs to be greater than 0 and less than 100000";
            valid = false;
        }

        if (!pkg.width) {
            copy.width = "Width is required";
            valid = false;
        } else if (!numberOnlyRegex.test(pkg.width)) {
            copy.width = "Width needs to be a number";
            valid = false;
        } else if (pkg.width < 0 || pkg.width > 100000) {
            copy.width = "Width needs to be greater than 0 and less than 100000";
            valid = false;
        }

        if (!pkg.height) {
            copy.height = "Height is required";
            valid = false;
        } else if (!numberOnlyRegex.test(pkg.height)) {
            copy.height = "Height needs to be a number";
            valid = false;
        } else if (pkg.height < 0 || pkg.height > 100000) {
            copy.height = "Height needs to be greater than 0 and less than 100000";
            valid = false;
        }

        setErrors(copy)
        return valid;
    }
    const loadOrders = async () => {
        try {
            const res = await getAllOrders();
            setOrders(res.data);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load orders", "error");
        }
    };

    const loadPackage = async () => {
        try {
            const res = await getPackageById(id);
            const data = res.data;
            // 2. CARGA CORRECTA: Mapeamos directamente los campos planos
            setPkg({
                weight: data.weight || "",
                length: data.length || "", // Antes fallaba buscando data.dimensions.length
                width: data.width || "",
                height: data.height || "",
                orderId: data.orderId || "",
            });
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load package", "error");
        }
    };

    // 3. HANDLER UNIFICADO (Ya no necesitamos handleDimChange)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPkg({
            ...pkg,
            [name]: value // Guardamos como string para facilitar la edición, convertimos al enviar
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ weight: "", length: "", width: "", height: "", orderId: "" });
        if (!validateForm()) {
            Swal.fire({
                title: "Error",
                text: "Please correct the highlighted errors",
                icon: "error"
            });
            return;
        }
        // 4. PAYLOAD SIMPLE
        const payload = {
            weight: Number(pkg.weight),
            length: Number(pkg.length),
            width: Number(pkg.width),
            height: Number(pkg.height),
        };

        try {
            if (id) {
                await updatePackage(id, payload);
                Swal.fire("Updated", "Package updated successfully", "success");
                navigate(orderId ? `/orders/${orderId}/packages` : "/packages");
            } else {
                const actualOrderId = orderId || pkg.orderId;
                if (!actualOrderId) {
                    return Swal.fire("Validation", "Please select an Order", "warning");
                }
                await createPackageForOrder(actualOrderId, payload);
                Swal.fire("Created", "Package created successfully", "success");
                navigate(orderId ? `/orders/${actualOrderId}/packages` : "/packages");
            }
        } catch (e) {
            console.error("Error saving package", e);
            Swal.fire("Error", "Failed to save package", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit Package" : orderId ? "Add Package to Order" : "Add Package"}</h2>

            <form onSubmit={handleSubmit}>
                {!orderId && (
                    <div className="mb-3">
                        <label className="form-label">Order</label>
                        <select
                            className={`form-select ${errors.orderId ? "is-invalid" : ""}`}
                            name="orderId"
                            value={pkg.orderId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select Order --</option>
                            {orders.map((o) => (
                                <option key={o.id} value={o.id}>
                                    {`Order #${o.id} — ${o.details || "No details"}`}
                                </option>
                            ))}
                        </select>
                        {errors.orderId && (
                            <div className="invalid-feedback">{errors.orderId}</div>
                        )}
                    </div>
                )}

                {/* 5. INPUTS ACTUALIZADOS (Referencian pkg.length directamente) */}
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Length</label>
                        <input
                            type="number"
                            className={`form-control ${errors.length ? "is-invalid" : ""}`}
                            name="length"
                            value={pkg.length}
                            onChange={handleChange}
                            required
                        />
                        {errors.length && (
                            <div className="invalid-feedback">{errors.length}</div>
                        )}
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Width</label>
                        <input
                            type="number"
                            className={`form-control ${errors.width ? "is-invalid" : ""}`}
                            name="width"
                            value={pkg.width}
                            onChange={handleChange}
                            required
                        />
                        {errors.width && (
                            <div className="invalid-feedback">{errors.width}</div>
                        )}
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Height</label>
                        <input
                            type="number"
                            className={`form-control ${errors.height ? "is-invalid" : ""}`}
                            name="height"
                            value={pkg.height}
                            onChange={handleChange}
                            required
                        />
                        {errors.height && (
                            <div className="invalid-feedback">{errors.height}</div>
                        )}
                    </div>
                </div>

                <div className="mb-3 mt-3">
                    <label className="form-label">Weight</label>
                    <input
                        type="number"
                        className={`form-control ${errors.weight ? "is-invalid" : ""}`}
                        name="weight"
                        value={pkg.weight}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                    {errors.weight && (
                        <div className="invalid-feedback">{errors.weight}</div>
                    )}
                </div>

                <button type="submit" className="btn btn-success me-2">
                    Save
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(orderId ? `/orders/${orderId}/packages` : "/packages")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default PackageForm;

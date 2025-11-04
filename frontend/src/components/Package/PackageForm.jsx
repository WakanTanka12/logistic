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
    const { id, orderId } = useParams(); // id = packageId (edit), orderId = crear bajo order
    const navigate = useNavigate();

    const [pkg, setPkg] = useState({
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        orderId: "", // usado cuando NO hay orderId en la URL
    });

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!orderId) loadOrders(); // solo si no viene un orderId fijo
        if (id) loadPackage();
    }, [id, orderId]);

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
            setPkg({
                weight: data.weight || 0,
                dimensions: {
                    length: data.dimensions?.length || 0,
                    width: data.dimensions?.width || 0,
                    height: data.dimensions?.height || 0,
                },
                orderId: data.orderId || "",
            });
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load package", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // fields: weight, orderId
        setPkg({ ...pkg, [name]: name === "weight" ? Number(value) : value });
    };

    const handleDimChange = (e) => {
        const { name, value } = e.target;
        setPkg({
            ...pkg,
            dimensions: { ...pkg.dimensions, [name]: Number(value) },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // payload DTO
        const payload = {
            weight: Number(pkg.weight),
            dimensions: {
                length: Number(pkg.dimensions.length),
                width: Number(pkg.dimensions.width),
                height: Number(pkg.dimensions.height),
            },
            // orderId solo aplica cuando creas sin orderId fijo
            ...(orderId ? {} : { orderId: pkg.orderId ? Number(pkg.orderId) : null }),
        };

        try {
            if (id) {
                await updatePackage(id, payload);
                Swal.fire("Updated", "Package updated successfully", "success");
                navigate(orderId ? `/orders/${orderId}/packages` : "/packages");
            } else {
                if (orderId) {
                    await createPackageForOrder(orderId, payload);
                    Swal.fire("Created", "Package created for order successfully", "success");
                    navigate(`/orders/${orderId}/packages`);
                } else {
                    if (!payload.orderId) {
                        return Swal.fire("Validation", "Please select an Order", "warning");
                    }
                    await createPackageForOrder(payload.orderId, payload);
                    Swal.fire("Created", "Package created successfully", "success");
                    navigate("/packages");
                }
            }
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to save package", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit Package" : orderId ? "Add Package to Order" : "Add Package"}</h2>

            <form onSubmit={handleSubmit}>
                {/* Selección de Order si NO viene fija en la URL */}
                {!orderId && (
                    <div className="mb-3">
                        <label className="form-label">Order</label>
                        <select
                            className="form-select"
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
                    </div>
                )}

                {/* Dimensiones */}
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Length</label>
                        <input
                            type="number"
                            className="form-control"
                            name="length"
                            value={pkg.dimensions.length}
                            onChange={handleDimChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Width</label>
                        <input
                            type="number"
                            className="form-control"
                            name="width"
                            value={pkg.dimensions.width}
                            onChange={handleDimChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Height</label>
                        <input
                            type="number"
                            className="form-control"
                            name="height"
                            value={pkg.dimensions.height}
                            onChange={handleDimChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                {/* Peso */}
                <div className="mb-3 mt-3">
                    <label className="form-label">Weight</label>
                    <input
                        type="number"
                        className="form-control"
                        name="weight"
                        value={pkg.weight}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
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

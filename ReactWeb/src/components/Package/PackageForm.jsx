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
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        orderId: "",
    });

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!orderId) loadOrders();
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
            // 2. CARGA CORRECTA: Mapeamos directamente los campos planos
            setPkg({
                weight: data.weight || 0,
                length: data.length || 0, // Antes fallaba buscando data.dimensions.length
                width: data.width || 0,
                height: data.height || 0,
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
                navigate(`/orders/${actualOrderId}/packages`);
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

                {/* 5. INPUTS ACTUALIZADOS (Referencian pkg.length directamente) */}
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Length</label>
                        <input
                            type="number"
                            className="form-control"
                            name="length"
                            value={pkg.length}
                            onChange={handleChange}
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
                            value={pkg.width}
                            onChange={handleChange}
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
                            value={pkg.height}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

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

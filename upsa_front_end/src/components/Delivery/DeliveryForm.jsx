import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    createDelivery,
    getDeliveryById,
    updateDelivery,
} from "../../services/DeliveryService";
import { getAllOrders } from "../../services/OrderService";
import { getAllDrivers } from "../../services/DriverService";
import { getAllRoutes } from "../../services/RouteService";

const DeliveryForm = () => {
    const [delivery, setDelivery] = useState({
        deliveryDate: "",
        status: "PLANNED",
        orderId: "",
        driverId: "",
        routeId: "",
    });

    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    // Cargar combos + delivery si es edición
    useEffect(() => {
        loadOrders();
        loadDrivers();
        loadRoutes();
        if (id) loadDelivery();
    }, [id]);

    const loadOrders = async () => {
        try {
            const res = await getAllOrders();
            setOrders(res.data || []);
        } catch (error) {
            console.error("Error loading orders:", error);
            Swal.fire("Error", "Failed to load orders", "error");
        }
    };

    const loadDrivers = async () => {
        try {
            const res = await getAllDrivers();
            setDrivers(res.data || []);
        } catch (error) {
            console.error("Error loading drivers:", error);
            Swal.fire("Error", "Failed to load drivers", "error");
        }
    };

    const loadRoutes = async () => {
        try {
            const res = await getAllRoutes();
            setRoutes(res.data || []);
        } catch (error) {
            console.error("Error loading routes:", error);
            Swal.fire("Error", "Failed to load routes", "error");
        }
    };

    const loadDelivery = async () => {
        try {
            const res = await getDeliveryById(id);
            const data = res.data;

            setDelivery({
                deliveryDate: data.deliveryDate || "",
                status: data.status || "PLANNED",
                orderId: data.order?.id ?? data.orderId ?? "",
                driverId: data.driver?.id ?? data.driverId ?? "",
                routeId: data.route?.id ?? data.routeId ?? "",
            });
        } catch (error) {
            console.error("Error loading delivery:", error);
            Swal.fire("Error", "Failed to load delivery data", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDelivery({ ...delivery, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // orderId es obligatorio (OneToOne NOT NULL)
        if (!delivery.orderId) {
            Swal.fire("Validation", "Order is required", "warning");
            return;
        }

        const payload = {
            deliveryDate: delivery.deliveryDate || null, // LocalDate (YYYY-MM-DD)
            status: delivery.status || "PLANNED",
            orderId: Number(delivery.orderId),          // requerido
            driverId: delivery.driverId ? Number(delivery.driverId) : null, // opcional
            routeId: delivery.routeId ? Number(delivery.routeId) : null,    // opcional
        };

        try {
            if (id) {
                await updateDelivery(id, payload);
                Swal.fire("Updated", "Delivery updated successfully", "success");
            } else {
                await createDelivery(payload);
                Swal.fire("Created", "Delivery created successfully", "success");
            }
            navigate("/deliveries");
        } catch (error) {
            console.error("Error saving delivery:", error);
            Swal.fire("Error", "Failed to save delivery", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit Delivery" : "Add Delivery"}</h2>

            <form onSubmit={handleSubmit}>
                {/* Delivery Date */}
                <div className="mb-3">
                    <label className="form-label">Delivery Date</label>
                    <input
                        type="date"
                        name="deliveryDate"
                        className="form-control"
                        value={delivery.deliveryDate || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Status */}
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                        name="status"
                        className="form-select"
                        value={delivery.status}
                        onChange={handleChange}
                        required
                    >
                        {/* Ajusta estas opciones a tus enums/valores reales */}
                        <option value="PLANNED">PLANNED</option>
                        <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="FAILED">FAILED</option>
                    </select>
                </div>

                {/* Order (obligatorio) */}
                <div className="mb-3">
                    <label className="form-label">Order</label>
                    <select
                        name="orderId"
                        className="form-select"
                        value={delivery.orderId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Order --</option>
                        {orders.map((o) => (
                            <option key={o.id} value={o.id}>
                                #{o.id}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Driver (opcional) */}
                <div className="mb-3">
                    <label className="form-label">Driver (optional)</label>
                    <select
                        name="driverId"
                        className="form-select"
                        value={delivery.driverId}
                        onChange={handleChange}
                    >
                        <option value="">-- Unassigned --</option>
                        {drivers.map((d) => (
                            <option key={d.id} value={d.id}>
                                #{d.id} — {d.firstName} {d.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Route (opcional) */}
                <div className="mb-3">
                    <label className="form-label">Route (optional)</label>
                    <select
                        name="routeId"
                        className="form-select"
                        value={delivery.routeId}
                        onChange={handleChange}
                    >
                        <option value="">-- No route --</option>
                        {routes.map((r) => (
                            <option key={r.id} value={r.id}>
                                Route #{r.id} {r.routeDate ? `— ${r.routeDate}` : ""}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Buttons */}
                <button type="submit" className="btn btn-success me-2">
                    Save
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/deliveries")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default DeliveryForm;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createDelivery, updateDelivery, getDeliveryById } from "../../services/DeliveryService";
import { getAllOrders } from "../../services/OrderService";
import { getAllDrivers } from "../../services/DriverService";
import { getAllRoutes } from "../../services/RouteService"; // crea si aún no la tienes

const DeliveryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [delivery, setDelivery] = useState({
        deliveryDate: "",
        status: "",
        orderId: "",
        driverId: "",
        routeId: "",
    });

    const [orders, setOrders] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        loadOrders();
        loadDrivers();
        loadRoutes();
        if (id) loadDelivery();
    }, [id]);

    const loadOrders = async () => {
        try {
            const res = await getAllOrders();
            setOrders(res.data);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load orders", "error");
        }
    };
    const loadDrivers = async () => {
        try {
            const res = await getAllDrivers();
            setDrivers(res.data);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load drivers", "error");
        }
    };
    const loadRoutes = async () => {
        try {
            const res = await getAllRoutes(); // implementa en RouteService
            setRoutes(res.data);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load routes", "error");
        }
    };

    const loadDelivery = async () => {
        try {
            const res = await getDeliveryById(id);
            const d = res.data;
            setDelivery({
                deliveryDate: d.deliveryDate || "",
                status: d.status || "",
                orderId: d.orderId || "",
                driverId: d.driverId || "",
                routeId: d.routeId || "",
            });
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load delivery", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDelivery({ ...delivery, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            deliveryDate: delivery.deliveryDate || null,
            status: delivery.status,
            orderId: delivery.orderId ? Number(delivery.orderId) : null,
            driverId: delivery.driverId ? Number(delivery.driverId) : null,
            routeId: delivery.routeId ? Number(delivery.routeId) : null,
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
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to save delivery", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit Delivery" : "Add Delivery"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Delivery Date</label>
                    <input type="date" className="form-control" name="deliveryDate" value={delivery.deliveryDate || ""} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <input className="form-control" name="status" value={delivery.status} onChange={handleChange} required />
                </div>

                {/* Order (1:1) */}
                <div className="mb-3">
                    <label className="form-label">Order</label>
                    <select className="form-select" name="orderId" value={delivery.orderId || ""} onChange={handleChange} required>
                        <option value="">-- Select Order --</option>
                        {orders.map((o) => (
                            <option key={o.id} value={o.id}>
                                {`Order #${o.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Driver (N:1) */}
                <div className="mb-3">
                    <label className="form-label">Driver</label>
                    <select className="form-select" name="driverId" value={delivery.driverId || ""} onChange={handleChange}>
                        <option value="">-- Select Driver --</option>
                        {drivers.map((d) => (
                            <option key={d.id} value={d.id}>
                                {`#${d.id} — ${d.firstName} ${d.lastName} ${d.free ? "(free)" : ""}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Route (N:1) */}
                <div className="mb-3">
                    <label className="form-label">Route</label>
                    <select className="form-select" name="routeId" value={delivery.routeId || ""} onChange={handleChange}>
                        <option value="">-- Select Route --</option>
                        {routes.map((r) => (
                            <option key={r.id} value={r.id}>
                                {`#${r.id} — ${r.routeName}`}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-success me-2">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/deliveries")}>Cancel</button>
            </form>
        </div>
    );
};

export default DeliveryForm;

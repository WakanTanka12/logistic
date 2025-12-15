import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createDelivery, updateDelivery, getDeliveryById } from "../../services/DeliveryService";
import { getAllOrders } from "../../services/OrderService";
import { getAllDrivers } from "../../services/DriverService";
import { getAllRoutes } from "../../services/RouteService";

const STATUS_OPTIONS = [
    { label: "Pendiente", value: "PENDING" },
    { label: "En Ruta", value: "IN_ROUTE" },
    { label: "Entregado", value: "DELIVERED" },
];

const checkDateRange = (dateString, value, unit, type) => {
    // 1. Obtener la fecha seleccionada
    const selectedDate = new Date(dateString + "T00:00:00"); // Asegura que sea el inicio del día local

    // 2. Obtener la fecha de referencia (Hoy)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Calcular la fecha límite (boundary date)
    const boundaryDate = new Date(today);

    switch (unit) {
        case 'days':
            // Si es 'max', restamos; si es 'min', sumamos
            boundaryDate.setDate(boundaryDate.getDate() + (type === 'max' ? -value : value));
            break;
        case 'weeks':
            boundaryDate.setDate(boundaryDate.getDate() + (type === 'max' ? -value * 7 : value * 7));
            break;
        case 'months':
            boundaryDate.setMonth(boundaryDate.getMonth() + (type === 'max' ? -value : value));
            break;
        case 'years':
            boundaryDate.setFullYear(boundaryDate.getFullYear() + (type === 'max' ? -value : value));
            break;
        default:
            return true;
    }

    // 4. Realizar la comparación
    if (type === 'max') {
        // Validación MÁXIMO: La fecha seleccionada DEBE ser posterior o igual a la fecha límite
        return selectedDate >= boundaryDate;
    } else if (type === 'min') {
        // Validación MÍNIMO: La fecha seleccionada DEBE ser anterior o igual a la fecha límite
        return selectedDate <= boundaryDate;
    }

    return false;
};

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
    const [errors, setErrors] = useState({
        deliveryDate: "",
        status: "",
        orderId: "",
        driverId: "",
        routeId: "",
    });

    useEffect(() => {
        loadOrders();
        loadDrivers();
        loadRoutes();
        if (id) loadDelivery();
    }, [id]);

    function validateForm () {
        let valid = true;
        const copy = {
            deliveryDate: "",
            status: "",
            orderId: "",
            driverId: "",
            routeId: "",
        };

        // ------------------ VALIDACIÓN DE FECHA ------------------

        if(!delivery.deliveryDate) {
            copy.deliveryDate = "Delivery date is required";
            valid = false;
        } else {
            const deliveryDateString = delivery.deliveryDate; // YYYY-MM-DD

            // 1. VALIDACIÓN MÍNIMA (No puede ser en el pasado)
            // Usamos 'max' 0 días, lo que significa que la fecha seleccionada
            // debe ser mayor o igual a (hoy - 0 días)
            if (!checkDateRange(deliveryDateString, 0, 'days', 'max')) {
                copy.deliveryDate = "The delivery date cannot be in the past. Select today or a future date.";
                valid = false;
            }

            // 2. VALIDACIÓN MÁXIMA (Ejemplo: Máximo 1 año en el futuro)
            // La fecha seleccionada debe ser menor o igual a (hoy + 1 año)
            if (valid && !checkDateRange(deliveryDateString, 1, 'years', 'min')) {
                copy.deliveryDate = "The delivery date cannot be more than 1 year in the future.";
                valid = false;
            }
        }

        // ------------------ FIN VALIDACIÓN DE FECHA ------------------


        if(!delivery.status) {
            copy.status = "Status is required";
            valid = false;
        }

        if(!delivery.orderId) {
            copy.orderId = "An Order needs to be assigned"
            valid = false;
        }

        if(!delivery.driverId) {
            copy.driverId = "A Driver needs to be assigned"
            valid = false;
        }

        if(!delivery.routeId) {
            copy.routeId = "A Route needs to be assigned"
            valid = false;
        }

        setErrors(copy);
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
        if (!validateForm()) {
            Swal.fire({
                title: "Error",
                text: "Please correct the highlighted errors",
                icon: "error"
            });
            return;
        }

        const payload = {
            deliveryDate: delivery.deliveryDate || null,
            status: delivery.status,
            orderId: delivery.orderId ? Number(delivery.orderId) : null,
            driverId: delivery.driverId ? Number(delivery.driverId) : null,
            routeId: delivery.routeId ? Number(delivery.routeId) : null,
        };
        console.log("payload", payload);
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
                    <input
                        type="date"
                        className={`form-control ${errors.deliveryDate ? "is-invalid" : ""}`}
                        name="deliveryDate"
                        value={delivery.deliveryDate || ""}
                        onChange={handleChange}
                    />
                    {errors.deliveryDate && (
                        <div className="invalid-feedback">{errors.deliveryDate}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                        className={`form-select ${errors.status ? "is-invalid" : ""}`}
                        name="status"
                        value={delivery.status || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Status --</option>
                        {/* Mapea sobre la constante STATUS_OPTIONS */}
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
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

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createRoute, updateRoute, getRouteById } from "../../services/RouteService";

const toIsoDuration = (h, m) => {
    const H = Number(h) || 0;
    const M = Number(m) || 0;
    if (H === 0 && M === 0) return ""; // vacío si no ponen nada
    if (H > 0 && M > 0) return `PT${H}H${M}M`;
    if (H > 0) return `PT${H}H`;
    return `PT${M}M`;
};

const parseIsoDuration = (iso) => {
    // muy simple: extrae H y M si existen (p.ej. PT2H15M)
    if (!iso) return { h: "", m: "" };
    const h = (iso.match(/(\d+)H/) || [])[1] || "";
    const m = (iso.match(/(\d+)M/) || [])[1] || "";
    return { h, m };
};

const RouteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [route, setRoute] = useState({
        routeName: "",
        origin: "",
        destination: "",
        distance: "",
        estimatedDuration: "", // ISO-8601, ej: PT1H30M
    });

    // Aux para horas/minutos (opcional)
    const [{ h, m }, setHM] = useState({ h: "", m: "" });

    useEffect(() => {
        if (id) loadRoute();
    }, [id]);

    const loadRoute = async () => {
        try {
            const res = await getRouteById(id);
            const r = res.data;
            setRoute({
                routeName: r.routeName || "",
                origin: r.origin || "",
                destination: r.destination || "",
                distance: r.distance ?? "",
                estimatedDuration: r.estimatedDuration || "",
            });
            setHM(parseIsoDuration(r.estimatedDuration));
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load route", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoute({ ...route, [name]: value });
    };

    const handleHMChange = (e) => {
        const { name, value } = e.target;
        const next = { ...{ h, m }, [name]: value };
        setHM(next);
        // sincroniza ISO automáticamente
        setRoute((prev) => ({ ...prev, estimatedDuration: toIsoDuration(next.h, next.m) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const onlyLettersRegex = /^[A-Za-z\s]+$/;

// Validación de routeName
        if (!route.routeName || !onlyLettersRegex.test(route.routeName)) {
            Swal.fire("Error", "Route name cannot contain numbers", "error");
            return;
        }

// Validación de origin
        if (!route.origin || !onlyLettersRegex.test(route.origin)) {
            Swal.fire("Error", "Origin cannot contain numbers", "error");
            return;
        }

// Validación de destination
        if (!route.destination || !onlyLettersRegex.test(route.destination)) {
            Swal.fire("Error", "Destination cannot contain numbers", "error");
            return;
        }
        const payload = {
            routeName: route.routeName,
            origin: route.origin,
            destination: route.destination,
            distance: route.distance !== "" ? Number(route.distance) : null,
            // 🔹 Mantiene Duration en el DTO como string ISO (backend lo mapea a Duration)
            estimatedDuration: route.estimatedDuration || null,
        };

        try {
            if (id) {
                await updateRoute(id, payload);
                Swal.fire("Updated", "Route updated successfully", "success");
            } else {
                await createRoute(payload);
                Swal.fire("Created", "Route created successfully", "success");
            }
            navigate("/routes");
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to save route", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit Route" : "Add Route"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Route Name</label>
                    <input className="form-control" name="routeName" value={route.routeName} onChange={handleChange} required />
                </div>

                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Origin</label>
                        <input className="form-control" name="origin" value={route.origin} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Destination</label>
                        <input className="form-control" name="destination" value={route.destination} onChange={handleChange} required />
                    </div>
                </div>

                <div className="mb-3 mt-3">
                    <label className="form-label">Distance (km)</label>
                    <input type="number" step="0.01" className="form-control" name="distance" value={route.distance} onChange={handleChange} required />
                </div>

                {/* Duración: helper de H/M + ISO visible */}
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label">Hours</label>
                        <input type="number" min="0" className="form-control" name="h" value={h} onChange={handleHMChange} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Minutes</label>
                        <input type="number" min="0" className="form-control" name="m" value={m} onChange={handleHMChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Estimated Duration (ISO-8601)</label>
                        <input
                            className="form-control"
                            name="estimatedDuration"
                            value={route.estimatedDuration || ""}
                            onChange={handleChange}
                            placeholder="Ej: PT1H30M"
                        />
                        <small className="text-muted">Puedes editar manualmente el ISO si prefieres.</small>
                    </div>
                </div>

                <button type="submit" className="btn btn-success me-2 mt-3">Save</button>
                <button type="button" className="btn btn-secondary mt-3" onClick={() => navigate("/routes")}>Cancel</button>
            </form>
        </div>
    );
};

export default RouteForm;

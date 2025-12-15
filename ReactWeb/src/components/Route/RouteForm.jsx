import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { createRoute, updateRoute, getRouteById } from "../../services/RouteService";

const RouteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [route, setRoute] = useState({
        routeName: "",
        origin: "",
        destination: "",
    });

    // Aux para horas/minutos (opcional)

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
            });
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load route", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoute({ ...route, [name]: value });
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

                <button type="submit" className="btn btn-success me-2 mt-3">Save</button>
                <button type="button" className="btn btn-secondary mt-3" onClick={() => navigate("/routes")}>Cancel</button>
            </form>
        </div>
    );
};

export default RouteForm;

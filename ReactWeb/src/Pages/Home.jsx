// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// Iconos lucide-react
import {
    Users,           // Customers
    ClipboardList,   // Orders
    Truck,           // Deliveries
    Package as Box,  // Packages
    UserCog,         // Drivers
    Route as RouteIcon // Routes
} from "lucide-react";

const Home = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { user } = useAuth();

    // 🔹 Mini estadísticas simples (opcional)
    const [stats, setStats] = useState({
        customers: 0,
        orders: 0,
        deliveries: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [custRes, ordRes, delRes] = await Promise.all([
                    api.get("/customers"),
                    api.get("/orders"),
                    api.get("/deliveries"),
                ]);

                const customers = Array.isArray(custRes.data)
                    ? custRes.data
                    : custRes.data.content || [];

                const orders = Array.isArray(ordRes.data)
                    ? ordRes.data
                    : ordRes.data.content || [];

                const deliveries = Array.isArray(delRes.data)
                    ? delRes.data
                    : delRes.data.content || [];

                setStats({
                    customers: customers.length || 0,
                    orders: orders.length || 0,
                    deliveries: deliveries.length || 0,
                });
            } catch (err) {
                console.error("Error cargando estadísticas:", err);
            }
        };

        fetchStats();
    }, []);

    // 🧠 Nombre y rol bonitos
    const displayName = `${user?.firstname || ""} ${user?.lastname || ""}`.trim() || "User";
    const roleName =
        user?.role === "ROLE_ADMIN"
            ? "Administrator"
            : user?.role === "ROLE_USER"
                ? "User"
                : user?.role || "Guest";

    const modules = [
        {
            title: "Customers",
            description: "Create, edit and track your clients.",
            icon: <Users size={32} />,
            path: "/customers",
            color: "primary",
        },
        {
            title: "Orders",
            description: "Register orders and view details.",
            icon: <ClipboardList size={32} />,
            path: "/orders",
            color: "success",
        },
        {
            title: "Deliveries",
            description: "Assign orders to routes and drivers.",
            icon: <Truck size={32} />,
            path: "/deliveries",
            color: "info",
        },
        {
            title: "Packages",
            description: "Manage package dimensions and weight per order.",
            icon: <Box size={32} />,
            path: "/packages",
            color: "warning",
        },
        {
            title: "Drivers",
            description: "Create drivers and set availability (free/busy).",
            icon: <UserCog size={32} />,
            path: "/drivers",
            color: "danger",
        },
        {
            title: "Routes",
            description: "Define routes, distance and estimated duration.",
            icon: <RouteIcon size={32} />,
            path: "/routes",
            color: "secondary",
        },
    ];

    return (
        <div
            className={`container py-4 theme-transition ${
                theme === "dark" ? "text-light" : "text-dark"
            }`}
        >
            {/* 🔹 SALUDO CON USUARIO */}
            <div className="mb-4">
                <div className="card shadow-sm border-0">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="h4 mb-1">
                                👋 Welcome back,{" "}
                                <span className="fw-bold text-primary">{displayName}</span>
                            </h2>
                            <p className="mb-0 text-muted">
                                Role: <span className="fw-semibold">{roleName}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 MINI MÉTRICAS (opcionales) */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">Customers</p>
                                <h4 className="mb-0">{stats.customers}</h4>
                            </div>
                            <Users size={28} className="text-primary" />
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">Orders</p>
                                <h4 className="mb-0">{stats.orders}</h4>
                            </div>
                            <ClipboardList size={28} className="text-success" />
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">Deliveries</p>
                                <h4 className="mb-0">{stats.deliveries}</h4>
                            </div>
                            <Truck size={28} className="text-info" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 TARJETAS DE MÓDULOS (tu diseño original) */}
            <h1 className="fw-bold mb-3 text-center">
                Logistics Management Dashboard
            </h1>
            <p className="lead mb-4 text-center">
                Orchestrate customers, orders, deliveries, packages, drivers and routes in one place.
            </p>

            <div className="row g-4 justify-content-center">
                {modules.map((mod, index) => (
                    <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div
                            className={`card border-${mod.color} shadow-sm h-100`}
                            style={{
                                cursor: "pointer",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onClick={() => navigate(mod.path)}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.03)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                            }
                        >
                            <div className={`card-body text-${mod.color}`}>
                                <div className="mb-3">{mod.icon}</div>
                                <h5 className="card-title fw-semibold">{mod.title}</h5>
                                <p className="card-text text-secondary">
                                    {mod.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center">
                <p className="text-muted small">
                    End-to-end visibility for your logistics workflows.
                </p>
            </div>
        </div>
    );
};

export default Home;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

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
            className={`container text-center py-5 theme-transition ${
                theme === "dark" ? "text-light" : "text-dark"
            }`}
        >
            <h1 className="fw-bold mb-3">Logistics Management Dashboard</h1>
            <p className="lead mb-5">
                Orchestrate customers, orders, deliveries, packages, drivers and routes in one place.
            </p>

            <div className="row g-4 justify-content-center">
                {modules.map((mod, index) => (
                    <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div
                            className={`card border-${mod.color} shadow-sm h-100 hover-scale`}
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
                                <p className="card-text text-secondary">{mod.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5">
                <p className="text-muted small">
                    End-to-end visibility for your logistics workflows.
                </p>
            </div>
        </div>
    );
};

export default Home;

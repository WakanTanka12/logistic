import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Header — versión logística (Customer, Order, Delivery, Driver, Package, Route)
 * Diseño limpio con azul/blanco y botón de Logout.
 */

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
            <div className="container-fluid px-4">
                {/* 🔹 Brand / Logo */}
                <Link to="/" className="navbar-brand fw-bold text-primary">
                    Logistics Management System
                </Link>

                {/* 🔹 Toggle button para móviles */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* 🔹 Navigation Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    {isAuthenticated && (
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/customers">
                                    Customers
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/orders">
                                    Orders
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/packages">
                                    Packages
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/deliveries">
                                    Deliveries
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/drivers">
                                    Drivers
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/routes">
                                    Routes
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-outline-primary ms-3"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import MainLayout from "./Layouts/MainLayout.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import LoginPage from "./components/Auth/LoginPage.jsx";
import Home from "./Pages/Home.jsx";

// Páginas de cada módulo
import CustomerPage from "./Pages/CustomerPage.jsx";
import OrderPage from "./Pages/OrderPage.jsx";
import DeliveryPage from "./Pages/DeliveryPage.jsx";
import PackagePage from "./Pages/PackagePage.jsx";
import DriverPage from "./Pages/DriverPage.jsx";
import RoutePage from "./Pages/RoutePage.jsx";

/**
 * MainLayout
 * Mantiene la estructura general: header + contenido + footer.
 * El <Outlet /> representa las rutas internas (Customer, Order, Delivery, etc.)
 */
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ErrorBoundary>
                    <Router>
                        <Routes>
                            {/* Público */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* Privado bajo MainLayout */}
                            <Route element={<MainLayout />}>
                                <Route
                                    path="/"
                                    element={
                                        <PrivateRoute>
                                            <Home />
                                        </PrivateRoute>
                                    }
                                />

                                {/* Customers */}
                                <Route
                                    path="customers/*"
                                    element={
                                        <PrivateRoute>
                                            <CustomerPage />
                                        </PrivateRoute>
                                    }
                                />

                                {/* Orders */}
                                <Route
                                    path="orders/*"
                                    element={
                                        <PrivateRoute>
                                            <OrderPage />
                                        </PrivateRoute>
                                    }
                                />

                                {/* Deliveries */}
                                <Route
                                    path="deliveries/*"
                                    element={
                                        <PrivateRoute>
                                            <DeliveryPage />
                                        </PrivateRoute>
                                    }
                                />

                                {/* Packages */}
                                <Route
                                    path="packages/*"
                                    element={
                                        <PrivateRoute>
                                            <PackagePage />
                                        </PrivateRoute>
                                    }
                                />

                                {/* Drivers */}
                                <Route
                                    path="drivers/*"
                                    element={
                                        <PrivateRoute>
                                            <DriverPage />
                                        </PrivateRoute>
                                    }
                                />

                                {/* Routes */}
                                <Route
                                    path="routes/*"
                                    element={
                                        <PrivateRoute>
                                            <RoutePage />
                                        </PrivateRoute>
                                    }
                                />

                                {/* Fallback */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Route>
                        </Routes>
                    </Router>
                </ErrorBoundary>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;

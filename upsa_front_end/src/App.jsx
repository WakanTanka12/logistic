import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import MainLayout from "./layouts/MainLayout";
import ErrorBoundary from "./components/ErrorBoundary"; // ✅ nuevo import

import LoginPage from "./components/Auth/LoginPage";
import Home from "./pages/Home";
import DepartmentPage from "./pages/DepartmentPage";
import EmployeePage from "./pages/EmployeePage";
import SkillPage from "./pages/SkillPage";
import DependentPage from "./pages/DependentPage";
import EmployeeSkillPage from "./pages/EmployeeSkillPage";

/**
 * App.jsx — estructura final optimizada con ErrorBoundary
 * - Layout con Header/Footer (MainLayout)
 * - Autenticación lista para JWT
 * - PrivateRoute protege secciones internas
 * - ErrorBoundary evita pantallas blancas y muestra mensajes claros
 */

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                {/* 🧩 ErrorBoundary captura cualquier fallo en renderizado */}
                <ErrorBoundary>
                    <Router>
                        <Routes>
                            {/* 🔓 Public route (Login) */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* 🔐 Private routes under MainLayout */}
                            <Route element={<MainLayout />}>
                                <Route
                                    path="/"
                                    element={
                                        <PrivateRoute>
                                            <Home />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="departments/*"
                                    element={
                                        <PrivateRoute>
                                            <DepartmentPage />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="employees/*"
                                    element={
                                        <PrivateRoute>
                                            <EmployeePage />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="skills/*"
                                    element={
                                        <PrivateRoute>
                                            <SkillPage />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="dependents/*"
                                    element={
                                        <PrivateRoute>
                                            <DependentPage />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="employee-skills/*"
                                    element={
                                        <PrivateRoute>
                                            <EmployeeSkillPage />
                                        </PrivateRoute>
                                    }
                                />

                                {/* Redirect unknown paths to home */}
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

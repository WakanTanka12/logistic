import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllCustomers,
    deleteCustomer,
} from "../../services/CustomerService.js";

const EmployeeList = () => {
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();

    /** Load all employees on mount */
    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const res = await getAllCustomers();
            setCustomers(res.data);
        } catch (error) {
            console.error("Error loading employees:", error);
            Swal.fire("Error", "Failed to load employees", "error");
        }
    };

    /** Delete confirmation */
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This customer will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCustomer(id);
                    Swal.fire("Deleted!", "Customer has been deleted.", "success");
                    loadCustomers();
                } catch (error) {
                    console.error("Error deleting customer:", error);
                    Swal.fire("Error", "Failed to delete customer", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Employee List</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/customers/add")}
                >
                    Add Customer
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th style={{ width: "160px" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {customers.length > 0 ? (
                    customers.map((e) => (
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>
                                {e.firstName} {e.lastName}
                            </td>
                            <td>{e.email}</td>
                            <td>{e.departmentName || "-"}</td>
                            <td>
                                {e.skillNames && e.skillNames.length > 0
                                    ? e.skillNames.join(", ")
                                    : "-"}
                            </td>
                            <td>
                                <Link
                                    to={`/employees/edit/${e.id}`}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(e.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center text-muted">
                            No employees found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;

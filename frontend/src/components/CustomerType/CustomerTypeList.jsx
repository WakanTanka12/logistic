import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllCustomerTypes,
    deleteCustomerType,
} from "../../services/CustomerTypeService.js";

const CustomerTypeList = () => {
    const [customerTypes, setCustomerTypes] = useState([]);
    const navigate = useNavigate();

    /** Load all employees on mount */
    useEffect(() => {
        loadCustomerTypes();
    }, []);

    const loadCustomerTypes = async () => {
        try {
            const res = await getAllCustomerTypes();
            setCustomerTypes(res.data);
        } catch (error) {
            console.error("Error loading customerTypes:", error);
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
                    await deleteCustomerType(id);
                    Swal.fire("Deleted!", "Customer has been deleted.", "success");
                    loadCustomerTypes();
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
                <h2>CustomerType List</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/customerTypes/add")}
                >
                    Add Customer Type
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>Type</th>
                    <th style={{ width: "160px" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {customerTypes.length > 0 ? (
                    customerTypes.map((e) => (
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>
                                {e.type}
                            </td>
                            <td>
                                <Link
                                    to={`/customerTypes/edit/${e.id}`}
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
                            No customer Types found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerTypeList;

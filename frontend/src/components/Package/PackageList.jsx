import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getAllPackages,
    getPackagesByOrder,
    deletePackage,
} from "../../services/PackageService";

const PackageList = () => {
    const { orderId } = useParams();
    const [packages, setPackages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadPackages();
    }, [orderId]);

    const loadPackages = async () => {
        try {
            const res = orderId ? await getPackagesByOrder(orderId) : await getAllPackages();
            setPackages(res.data);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load packages", "error");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This package will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deletePackage(id);
                    Swal.fire("Deleted!", "Package has been deleted.", "success");
                    loadPackages();
                } catch (e) {
                    console.error(e);
                    Swal.fire("Error", "Failed to delete package", "error");
                }
            }
        });
    };

    const renderDims = (d) => {
        if (!d) return "-";
        return `${d.length} x ${d.width} x ${d.height}`;
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{orderId ? `Packages of Order #${orderId}` : "Package List"}</h2>
                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate(orderId ? `/orders/${orderId}/packages/add` : "/packages/add")
                    }
                >
                    Add Package
                </button>
            </div>

            <table className="table table-striped align-middle">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Dimensions (L × W × H)</th>
                    <th>Weight</th>
                    <th>Order</th>
                    <th style={{ width: "160px" }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {packages.length > 0 ? (
                    packages.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{renderDims(p.dimensions)}</td>
                            <td>{p.weight}</td>
                            <td>{p.orderId || "-"}</td>
                            <td>
                                <Link
                                    to={orderId ? `/orders/${orderId}/packages/edit/${p.id}` : `/packages/edit/${p.id}`}
                                    className="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center text-muted">
                            No packages found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default PackageList;

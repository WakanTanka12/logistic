import React, {useEffect, useState} from 'react'
import {addCustomerType, getCustomerType, updateCustomerType} from "../../services/CustomerTypeService.js";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const CustomerTypeForm = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [customerType, setCustomerType] = useState({
        type: "",
        customerId: "",
    });

    useEffect(() => {
        if (id) {
            loadCustomerType();
        }
    }, [])



    const loadCustomerType = async () => {
        try {
            const response = await getCustomerType(id);
            const d = response.data;
            setCustomerType({
                type: d.type || "",
                customerId: d.id || "",
            });

        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to load customer types", "error");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerType({ ...customerType, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            type: customerType.type || null,
            customerId: customerType.customerId ? Number(customerType.customerId) : null,
        };
        try {
            if (id) {
                await updateCustomerType(id, payload);
                Swal.fire("Updated", "Delivery updated successfully", "success");
            } else {
                await addCustomerType(payload);
                Swal.fire("Created", "Delivery created successfully", "success");
            }
            navigate("/customerTypes");
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to save customer type", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{id ? "Edit CustomerType" : "Add CustomerType"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Customer Type</label>
                    <input
                        type="text"
                        className="form-control"
                        name="type"
                        value={customerType.type || ""}
                        onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-success me-2">Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/customerTypes")}>Cancel</button>
            </form>
        </div>
    );
};

export default CustomerTypeForm

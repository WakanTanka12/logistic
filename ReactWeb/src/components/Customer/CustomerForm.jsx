import { useEffect, useState } from "react";
import {
    addCustomer,
    getCustomer,
    updateCustomer,
} from "../../services/CustomerService.js";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const CustomerForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });

    const navigate = useNavigate();
    const { id } = useParams();

    // 🔹 Cargar para editar
    useEffect(() => {
        if (id) {
            getCustomer(id)
                .then((response) => {
                    const c = response.data;
                    setFirstName(c.firstName || "");
                    setLastName(c.lastName || "");
                    setEmail(c.email || "");
                    setPhone(c.phone || "");
                    setAddress(c.address || "");
                })
                .catch((err) => {
                    console.error("Error al cargar customer:", err);
                    alert(
                        "Error al cargar el cliente. Mira la consola para más detalles."
                    );
                });
        }
    }, [id]);

    function validateForm() {
        let valid = true;
        const copy = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
        };

        const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[67][0-9]{7}$/;

        if (!firstName.trim()) {
            copy.firstName = "First name is required";
            valid = false;

        } else if (!onlyLettersRegex.test(firstName)) {
            copy.firstName = "First name cannot contain numbers";
            valid = false;
        } else if (!firstName.trim().length < 2 || !firstName.trim().length > 50) {
            copy.lastName = "First name needs to be between 2 and 50 characters";
            valid = false;
        }

        if (!lastName.trim()) {
            copy.lastName = "Last name is required";
            valid = false;
        } else if (!onlyLettersRegex.test(lastName)) {
            copy.lastName = "Last name cannot contain numbers";
            valid = false;
        } else if (!lastName.trim().length < 2 || !lastName.trim().length > 50) {
            copy.lastName = "Last name needs to be between 2 and 50 characters";
            valid = false;
        }

        if (!email.trim()) {
            copy.email = "Email is required";
            valid = false;
        } else if (!emailRegex.test(email)) {
            copy.email = "Email is not correct";
            valid = false;
        }

        if (!phone.trim()) {
            copy.phone = "Phone is required";
            valid = false;
        } else {
            if (!phoneRegex.test(phone)) {
                copy.phone = "Phone is invalid";
                valid = false;
            }
        }

        if (!address.trim()) {
            copy.address = "Address is required";
            valid = false;
        }

        setErrors(copy);
        return valid;
    }

    function saveCustomerOrUpdate(e) {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire({
                title: "Error de validación",
                text: "Uno o más campos son incorrectos",
                icon: "error",
                confirmButtonText: "Ok"
            });
            return;
        }

        const customer = { firstName, lastName, email, phone, address };

        if (id) {
            // 🔄 UPDATE
            updateCustomer(id, customer)
                .then((res) => {
                    console.log("Customer updated:", res.data);
                    Swal.fire("Actualizado", "El cliente ha sido actualizado", "success")
                    navigate("/customers");
                })
                .catch((error) => {
                    console.error("Error UPDATE:", error);
                    Swal.fire("Error","No se pudo actualizar al cliente", "error" );
                });
        } else {
            // 🆕 CREATE
            addCustomer(customer)
                .then((res) => {
                    console.log("Customer created:", res.data);
                    Swal.fire("Registrado", "El cliente ha sido registrado", "success")
                    navigate("/customers");
                })
                .catch((error) => {
                    console.error("Error CREATE:", error);
                    Swal.fire("Error", "No se pudo crear al cliente", "error")
                });
        }
    }

    function pageTitle() {
        return (
            <h2 className="text-center">
                {id ? "Update Customer" : "Add Customer"}
            </h2>
        );
    }

    return (
        <div className="container">
            <br />
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    {pageTitle()}
                    <div className="card-body">
                        <form onSubmit={saveCustomerOrUpdate}>
                            <div className="form-group mb-2">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={firstName}
                                    placeholder="Enter First Name"
                                    className={`form-control ${
                                        errors.firstName ? "is-invalid" : ""
                                    }`}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />
                                {errors.firstName && (
                                    <div className="invalid-feedback">
                                        {errors.firstName}
                                    </div>
                                )}
                            </div>

                            <div className="form-group mb-2">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={lastName}
                                    placeholder="Enter Last Name"
                                    className={`form-control ${
                                        errors.lastName ? "is-invalid" : ""
                                    }`}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                                {errors.lastName && (
                                    <div className="invalid-feedback">
                                        {errors.lastName}
                                    </div>
                                )}
                            </div>

                            <div className="form-group mb-2">
                                <label className="form-label">Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={email}
                                    placeholder="Enter Email"
                                    className={`form-control ${
                                        errors.email ? "is-invalid" : ""
                                    }`}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            <div className="form-group mb-2">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={phone}
                                    placeholder="Enter Phone"
                                    className={`form-control ${
                                        errors.phone ? "is-invalid" : ""
                                    }`}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                />
                                {errors.phone && (
                                    <div className="invalid-feedback">
                                        {errors.phone}
                                    </div>
                                )}
                            </div>

                            <div className="form-group mb-2">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={address}
                                    placeholder="Enter Address"
                                    className={`form-control ${
                                        errors.address ? "is-invalid" : ""
                                    }`}
                                    onChange={(e) =>
                                        setAddress(e.target.value)
                                    }
                                />
                                {errors.address && (
                                    <div className="invalid-feedback">
                                        {errors.address}
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-success">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerForm;

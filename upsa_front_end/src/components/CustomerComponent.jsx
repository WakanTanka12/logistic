import { useState } from 'react'
import { addCustomer } from "../services/CustomerService.js";
import { useNavigate } from "react-router-dom";

const CustomerComponent = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    function saveCustomer(e) {
        e.preventDefault();

        const customer = { firstName, lastName, email, phone, address };

        addCustomer(customer).then((response) => {
            console.log(response.data);
            navigate('/customers'); // Cambiado de /employees

        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div className="container">
            <br/>
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    <div className="card-body">
                        <form>
                            <div className="form-group mb-2">
                                <label className="form-label">First Name</label>
                                <input
                                    type='text'
                                    name="firstName"
                                    value={firstName}
                                    placeholder="Enter First Name"
                                    className="form-control"
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Last Name</label>
                                <input
                                    type='text'
                                    name="lastName"
                                    value={lastName}
                                    placeholder="Enter Last Name"
                                    className="form-control"
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Email</label>
                                <input
                                    type='text'
                                    name="email"
                                    value={email}
                                    placeholder="Enter Email"
                                    className="form-control"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Address</label>
                                <input
                                    type='text'
                                    name="address"
                                    value={address}
                                    placeholder="Enter Address"
                                    className="form-control"
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Phone</label>
                                <input
                                    type='text'
                                    name="phone"
                                    value={phone}
                                    placeholder="Enter Phone"
                                    className="form-control"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-success"
                                    onClick={saveCustomer}>Submit</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerComponent

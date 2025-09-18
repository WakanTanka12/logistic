import {useEffect, useState} from 'react'
import {addCustomer, getCustomer, updateCustomer} from "../services/CustomerService.js";
import { useNavigate, useParams } from "react-router-dom";

const CustomerComponent = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');

    const navigate = useNavigate();

    const {id} = useParams();

    //Cargar el formulario del empleado que deseamos modificar
    useEffect(() => {
        if (id){
            getCustomer(id).then((response) => {
                console.log(response.data);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
                setPhone(response.data.phone);
                setAddress(response.data.address);
                setAge(response.data.age);
                setGender(response.data.gender)
            })
        }
    }, [id])

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        age: '',
        gender: ''
    });

    function saveCustomerOrUpdate(e) {
        e.preventDefault();

        console.log("Customer ID BEFORE:",id);

        if (validateForm()){
            const customer = {firstName, lastName, email, phone, address, age, gender};

            console.log("Customer ID AFTER:",id);

            if (id){
                updateCustomer(id, customer).then((response) => {
                    console.log(response.data);
                    navigate('/customers');
                }).catch((error) => {
                    console.log(error);
                })
            } else {
                addCustomer(customer).then((response)   => {
                    console.log(response.data);
                    navigate('/customers');

                }).catch(error => {
                    console.log(error);
                })
            }
        }
    }

    function validateForm(){
        let valid = true;

        const errorsCopy = {...errors};

        if (firstName.trim()) {
            errorsCopy.firstName = '';
        } else {
            errorsCopy.firstName = 'First name is required';
            valid = false;
        }

        if (lastName.trim()) {
            errorsCopy.lastName = '';
        } else {
            errorsCopy.lastName = 'Last name is required';
            valid = false;
        }

        if (email.trim()) {
            errorsCopy.email = '';
        } else {
            errorsCopy.email = 'Email is required';
            valid = false;
        }

        if (email.trim()) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                errorsCopy.email = 'Email is not correct';
                valid = false;
            }
        }

        if (address.trim()) {
            errorsCopy.address = '';
        } else {
            errorsCopy.address = 'Address is required';
            valid = false;
        }

        if (phone.trim()) {
            errorsCopy.phone = '';
        } else {
            errorsCopy.phone = 'Phone is required';
            valid = false;
        }

        if (age) {
            errorsCopy.age = '';
        } else {
            errorsCopy.age = 'Age is required';
            valid = false;
        }

        if (gender.trim()) {
            errorsCopy.gender = '';
        } else {
            errorsCopy.gender = 'Gender is required';
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    }

    function pageTitle(){
        if (id){
            return <h2 className='text-center'>Update Employee</h2>
        } else{
            return <h2 className='text-center'>Add Employee</h2>
        }
    }


    return (
        <div className="container">
            {/*<br/> Salta una linea*/}
            <br/>
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    {
                        pageTitle()
                    }
                    <div className="card-body">
                        <form>
                            <div className="form-group mb-2">
                                <label className="form-label">First Name</label>
                                <input
                                    type='text'
                                    name="firstName"
                                    value={firstName}
                                    placeholder="Enter First Name"
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Last Name</label>
                                <input
                                    type='text'
                                    name="lastName"
                                    value={lastName}
                                    placeholder="Enter Last Name"
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Email</label>
                                <input
                                    type='text'
                                    name="email"
                                    value={email}
                                    placeholder="Enter Email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Address</label>
                                <input
                                    type='text'
                                    name="address"
                                    value={address}
                                    placeholder="Enter Address"
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Phone</label>
                                <input
                                    type='text'
                                    name="phone"
                                    value={phone}
                                    placeholder="Enter Phone"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Age</label>
                                <input
                                type='text'
                                name="age"
                                value={age}
                                placeholder="Enter Age"
                                className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                                onChange={(e) => setAge(e.target.value)}
                                />
                                {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label">Gender</label>
                                <input
                                    type='text'
                                    name="gender"
                                    value={gender}
                                    placeholder="Enter Gender"
                                    className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                            </div>
                            <button type="submit" className="btn btn-success"
                                    onClick={saveCustomerOrUpdate}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CustomerComponent

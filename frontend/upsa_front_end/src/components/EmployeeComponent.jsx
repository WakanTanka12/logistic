import {useEffect, useState} from 'react'
import { addEmployee } from "../services/EmployeeService.js";
import { useNavigate } from "react-router-dom";

const EmployeeComponent = () => {

    const [firstName, setFirstName] = useState(''); //1ro el que se guarda en memoria y
    // luego el segundo es el que se envía// */
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const navigate = useNavigate();
    //Crear un objeto que inicialice las propiedades en vacio
    const [errors, setErrors] = useState( //declarando un useState de un vector
        {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
        }
    );


    function saveEmployee(e) {
        e.preventDefault();

        const employee = {firstName, lastName, email, phone, address};

        addEmployee(employee).then((response)   => {
            console.log(response.data);
            navigate('/employees');

        }).catch(error => {
            console.log(error);
        })
    }
    function validateForm(){
        let valid = true;
        const errorsCopy = {...errors}// ... indica que va copiando segun las veces que llames el objeto
        if (firstName.trim()){ //trim suprime espacios en blanco
            errorsCopy.firstName ='';
        } else{
            errorsCopy.firstName ='First Name is required';
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    }
    return (
        <div className="container">
            {/*<br/> Salta una linea*/}
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
                                    className={`form-control ${errors.firstName ? errors.firstName:''}` }//`` permite combinar texto + el leer el valor de alguna variable
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
                                    onClick={saveEmployee}>Submit</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EmployeeComponent

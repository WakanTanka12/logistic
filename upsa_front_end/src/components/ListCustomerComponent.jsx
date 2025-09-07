import { useEffect, useState } from 'react'
import { getAllCustomers, deleteCustomer } from '../services/CustomerService.js'
import { useNavigate } from 'react-router-dom'

const ListCustomerComponent = () => {

    // Hook useState para manejar la lista de clientes
    const [customers, setCustomers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        listAllCustomers();
    }, []) // <-- agregar [] para que solo se ejecute una vez

    function listAllCustomers() {
        getAllCustomers().then(response => {
            console.log(response.data)
            setCustomers(response.data)
        }).catch(err => {
            console.log(err)
        })
    }

    function addNewCustomer() {
        navigate('/add-customer')
    }

    function updateCustomer(id) {
        navigate(`/edit-customer/${id}`)
    }

    function removeCustomer(id) {
        deleteCustomer(id).then(response => {
            console.log(response.data)
            listAllCustomers()
        })
    }

    return (
        <div className='container'>
            <h2 className='text-center'>Listado de clientes</h2>
            <button className='btn btn-primary' onClick={addNewCustomer}>Add Customer</button>
            <table className='table table-striped table-dark table-bordered'>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((customer) =>
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.firstName}</td>
                        <td>{customer.lastName}</td>
                        <td>{customer.email}</td>
                        <td>{customer.address}</td>
                        <td>{customer.phone}</td>
                        <td>
                            <button className='btn btn-info' onClick={() => updateCustomer(customer.id)}>Update</button>
                            <button className='btn btn-danger' style={{ marginLeft: '10px' }}
                                    onClick={() => removeCustomer(customer.id)}>Delete</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}

export default ListCustomerComponent

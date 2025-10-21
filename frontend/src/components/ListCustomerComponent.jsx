import {useEffect, useState} from 'react'
import { getAllCustomers, deleteCustomer } from '../services/CustomerService.js'
import { useNavigate } from 'react-router-dom'

const ListCustomerComponent = () => {

    /*
     *Vamos a usar el hook useState para recuperar los valores
     *de la lista de empleados tanto en el objeto y luego asignarlo
     * a las casillas del formulario en HTML
     */
    const  [customers, setCustomers] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        ListAllCustomer();
    })
    function ListAllCustomer(){
        getAllCustomers().then(response=>{
            console.log(response.data)
            setCustomers(response.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    function addNewCustomer(){
        navigate('/add-customer')
    }
    function updateCustomer(id){
        navigate(`/edit-customer/${id}`)
    }
    function removeCustomer(id){
        deleteCustomer(id).then(response=>{
            console.log(response.data);
            ListAllCustomer();
        })
    }
    return (
        <div className='container'>
            <h2 className='text-center'>Listado de Clientes</h2>
            <button className='btn btn-primary' onClick={addNewCustomer}>Add Customer</button>
            <table className='table table-striped table-dark table-bordered'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
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
                        <td>{customer.phone}</td>
                        <td>{customer.address}</td>
                        <td>
                            <button className='btn btn-info'
                                    onClick={()=>updateCustomer(customer.id)}>Update</button>

                            <button className='btn btn-danger' style={{marginLeft:'10px'}}
                                    onClick={()=>removeCustomer(customer.id)}>Delete</button>
                        </td>
                    </tr>)
                }
                </tbody>
            </table>
        </div>
    )
}
export default ListCustomerComponent

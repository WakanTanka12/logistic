import {useEffect, useState} from 'react'
import { getAllEmployees, deleteEmployee } from '../services/EmployeeService.js'
import { useNavigate } from 'react-router-dom'
const ListEmployeeComponent = () => {

    /*
     *Vamos a usar el hook useState para recuperar los valores
     *de la lista de empleados tanto en el objeto y luego asignarlo
     * a las casillas del formulario en HTML
     */
    const  [employees, setEmployees] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        ListAllEmployee();
    })
    function ListAllEmployee(){
        getAllEmployees().then(response=>{
            console.log(response.data)
            setEmployees(response.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    function addNewEmployee(){
        navigate('/add-employee')
    }
    function updateEmployee(id){
        navigate(`/edit-employee/${id}`)
    }
    function removeEmployee(id){
        deleteEmployee(id).then(response=>{
            console.log(response.data);
            ListAllEmployee();
        })
    }
    return (
        <div className='container'>
            <h2 className='text-center'>listado de empleados</h2>
            <button className='btn btn-primary' onClick={addNewEmployee}>Add Employee</button>
            <table className='table table-striped table-dark table-bordered'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                {employees.map((employee) =>
                    <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.firstName}</td>
                        <td>{employee.lastName}</td>
                        <td>{employee.email}</td>
                        <td>{employee.address}</td>
                        <td>{employee.phone}</td>
                        <td>
                            <button className='btn btn-info'>Update</button>
                            <button className='btn btn-danger' style={{marginLeft:'10px'}}

                            onClick={()=>removeEmployee(employee.id)}>Delete</button>
                        </td>
                    </tr>)
                }


                </tbody>
            </table>
        </div>
    )
}
export default ListEmployeeComponent

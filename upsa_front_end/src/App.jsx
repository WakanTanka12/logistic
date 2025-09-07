
import './App.css'
import ListEmployeeComponent from "./components/ListCustomerComponent.jsx";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent.jsx";
import FooterComponent from "./components/FooterComponent.jsx";
import EmployeeComponent from "./components/CustomerComponent.jsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <HeaderComponent/>
            <Routes>
                <Route path="/" element={<ListCustomerComponent/>}></Route>
                <Route path="/employees" element={<ListCustomerComponent/>}></Route>
                <Route path="/add-employee" element={<CustomerComponent/>}></Route>
            </Routes>
            <FooterComponent/>
        </BrowserRouter>
     </>
  )
}

export default App

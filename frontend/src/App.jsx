
import './App.css'
import ListCustomerComponent from "./components/ListCustomerComponent.jsx";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent.jsx";
import FooterComponent from "./components/FooterComponent.jsx";
import CustomerComponent from "./components/CustomerComponent.jsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <HeaderComponent/>
            <Routes>
                <Route path="/" element={<ListCustomerComponent/>}></Route>
                <Route path="/customers" element={<ListCustomerComponent/>}></Route>
                <Route path="/add-customer" element={<CustomerComponent/>}></Route>
                <Route path="/edit-customer/:id" element={<CustomerComponent/>}></Route>
            </Routes>
            <FooterComponent/>
        </BrowserRouter>
     </>
  )
}

export default App

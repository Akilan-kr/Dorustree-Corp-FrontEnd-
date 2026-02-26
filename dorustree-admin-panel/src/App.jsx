import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {Route, Routes, useNavigate} from 'react-router-dom';
import './App.css'
import { useContext } from 'react';
import { StoreContext } from './Context/StoreContext';
import { useEffect } from 'react';
import Login from './Pages/Login/Login';
import DashboardSidebar from './Components/DashboardSidebar/DashboardSidebar';
import Menubar from './Components/MenuBar/MenuBar';
import { isUserTokenExpired } from './Service/Authservice';
import UserManagement from './Pages/UserManagement/UserManagement';
import Dashboard from './Pages/Dashboard/Dashboard';
import Orders from './Pages/Orders/Orders';
import ProductInventory from './Pages/ProductInventory/ProductInventory';

function App() {
    const {user} = useContext(StoreContext);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        if (isUserTokenExpired()) {
            logout();
        }
    }, []);


  return (
    <>
      <Menubar />

      <div style={{ display: "flex" }}>

        {/* Sidebar */}
        <DashboardSidebar />

        {/* Page Content */}
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/allusers" element={<UserManagement />} />
            <Route path="/productinventory" element={<ProductInventory />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>

      </div>

    </>
  )
}

export default App

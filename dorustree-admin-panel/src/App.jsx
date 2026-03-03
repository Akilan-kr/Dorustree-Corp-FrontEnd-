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
import RequestFromUser from './Pages/RequestFromUser/RequestFromUser';
import { ToastContainer } from 'react-toastify';
import { useLocation } from "react-router-dom";
import EditProduct from './Components/EditProduct/EditProduct';


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

    const location = useLocation();
    const isLoginPage = location.pathname === "/login" || location.pathname === "/";



  return (
<>
    <Menubar />
    <ToastContainer 
    autoClose={2000}/>

    {isLoginPage ? (
      // 🔥 Login layout (no sidebar)
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    ) : (
      // 🔥 Admin layout
      <div style={{ display: "flex" }}>
        <DashboardSidebar />

        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/dashboard" element={user?.role == "ADMIN" ? <Dashboard /> : <Login />} />
            <Route path="/allusers" element={user?.role == "ADMIN" ? <UserManagement /> : <Login />} />
            <Route path="/userrequest" element={user?.role === "ADMIN" ? <RequestFromUser /> : <Login />} />
            <Route path="/productinventory" element={user?.role === "ADMIN" ? <ProductInventory /> : <Login />} />
            <Route path="/orders" element={user?.role === "ADMIN" ? <Orders /> : <Login />} />
            <Route path="/mydashboard/editproduct/:id" element={user?.role === "ADMIN" ? <EditProduct />: <Login/>} />
          </Routes>
        </div>
      </div>
    )}
  </>

  )
}

export default App

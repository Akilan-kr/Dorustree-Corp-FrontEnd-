import { useContext, useEffect, useState } from 'react'
// import './App.css'
import { ToastContainer } from "react-toastify";
import {Route, Routes, useNavigate} from 'react-router-dom';
import Home from './Pages/Home/Home'
import MenuBar from './Components/MenuBar/MenuBar';
import { StoreContext } from './Context/StoreContext';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ExploreProduct from './Pages/ExploreProduct/ExploreProduct';
import Dashboard from './Pages/Dashboard/Dashboard';
import RequestVendor from './Pages/RequestVendor/RequestVendor';
import EditProduct from './Components/EditProduct/EditProduct';
import ProductInventory from './Pages/ProductInventory/ProductInventory';
import ReceivedOrders from './Pages/ReceivedOrders/ReceivedOrders';
import VendorProfile from './Pages/VendorProfile/VendorProfile';
import { isUserTokenExpired } from './Services/Authservice';
import Cart from './Pages/Cart/Cart';
import PreviousOrders from './Pages/PreviousOrders/PreviousOrders';
import Order from './Pages/Order/Order';
import AddProduct from './Pages/AddProducts/AddProducts';
import { Toast } from 'bootstrap';

function App() {
  // const [count, setCount] = useState(0)

    const { user, setUser } = useContext(StoreContext);

    const navigate = useNavigate();

    // if (loading) {
    //   return null; // prevent first wrong render
    // }

    const logout = () => {
        localStorage.removeItem("user");

        setUser({
            email: "",
            userRole: "",
            token: ""
        });

        navigate("/login");
    };


    useEffect(() => {
      const interval = setInterval(() => {
        if (isUserTokenExpired()) {
            logout();
        }
      }, 60000); // check every 1 min

      return () => clearInterval(interval);
    }, []);


  return (
    <div>
      <MenuBar/>
        <ToastContainer
            // position="top-right"
            autoClose={2000}
            // hideProgressBar={false}
            // newestOnTop
            // closeOnClick
            // pauseOnHover
            // theme="colored"
        />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={ user.token? <Home /> : <Login />}/>
        <Route path='/register' element={user.token ? <Home /> : <Register />}/>
        <Route path='/explore' element={<ExploreProduct />}/>
        <Route path='/mydashboard' element={user.userRole == "VENDOR" ? <VendorProfile/> : <Home />}/>
        <Route path='/becamevendor' element={user.userRole == "VENDOR" ? <Dashboard /> : <RequestVendor/> }/>
        <Route path='/addproduct' element={user.userRole == "VENDOR" ? <AddProduct/> : <Home />}/>
        <Route path='/productinventory' element={user.userRole == "VENDOR" ? <ProductInventory/> : <Home/>}/>
        <Route path='/vendorprofile' element={user.userRole == "VENDOR" ? <VendorProfile/>  : <Home/> }/>
        <Route path='/receivedorders' element={user.userRole == "VENDOR" ? <ReceivedOrders/> : <Home/>}/>
        <Route path='/previousorders' element={user.userRole == "VENDOR" ? <PreviousOrders/> : <Home />}/>
        <Route path='/myorders' element={<Order/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path="/mydashboard/editproduct/:id" element={user.userRole == "VENDOR" ? <EditProduct /> : <Home/>} />
      </Routes>
    </div>
  )
}

export default App

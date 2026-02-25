import { useContext, useEffect, useState } from 'react'
// import './App.css'
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
import AddProduct from './Components/AddProducts/AddProducts';
import ProductInventory from './Pages/ProductInventory/ProductInventory';
import ReceivedOrders from './Pages/ReceivedOrders/ReceivedOrders';
import VendorProfile from './Pages/VendorProfile/VendorProfile';
import { isUserTokenExpired } from './Services/Authservice';
import Cart from './Pages/Cart/Cart';
import PreviousOrders from './Pages/PreviousOrders/PreviousOrders';
import Order from './Pages/Order/Order';

function App() {
  // const [count, setCount] = useState(0)

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
    <div>
      <MenuBar/>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={ user.token? <Home /> : <Login />}/>
        <Route path='/register' element={user.token ? <Home /> : <Register />}/>
        <Route path='/explore' element={<ExploreProduct />}/>
        <Route path='/mydashboard' element={user.userRole == "VENDOR" ? <VendorProfile/> : <Home />}/>
        <Route path='/becamevendor' element={user.userRole == "USER" ? <RequestVendor/> : <Dashboard />}/>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/productinventory' element={<ProductInventory/>}/>
        <Route path='/vendorprofile' element={<VendorProfile/>}/>
        <Route path='/receivedorders' element={<ReceivedOrders/>}/>
        <Route path='/previousorders' element={<PreviousOrders/>}/>
        <Route path='/myorders' element={<Order/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path="/mydashboard/editproduct/:id" element={<EditProduct />} />
      </Routes>
    </div>
  )
}

export default App

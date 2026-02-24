import { useContext, useState } from 'react'
// import './App.css'
import {Route, Routes} from 'react-router-dom';
import Home from './Pages/Home/Home'
import MenuBar from './Components/MenuBar/MenuBar';
import { StoreContext } from './Context/StoreContext';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ExploreProduct from './Pages/ExploreProduct/ExploreProduct';
import Dashboard from './Pages/Dashboard/Dashboard';
import RequestVendor from './Components/RequestVendor/RequestVendor';
import EditProduct from './Components/EditProduct/EditProduct';
import AddProduct from './Components/AddProducts/AddProducts';
import ProductInventory from './Components/ProductInventory/ProductInventory';
import ReceivedOrders from './Components/ReceivedOrders/ReceivedOrders';
import VendorProfile from './Components/VendorProfile/VendorProfile';

function App() {
  // const [count, setCount] = useState(0)

  const {user} = useContext(StoreContext);


  return (
    <div>
      <MenuBar/>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={ user.token? <Home /> : <Login />}/>
        <Route path='/register' element={user.token ? <Home /> : <Register />}/>
        <Route path='/explore' element={<ExploreProduct />}/>
        <Route path='/mydashboard' element={user.userRole == "VENDOR" ? <Dashboard/> : <Home />}/>
        <Route path='/becamevendor' element={user.userRole == "USER" ? <RequestVendor/> : <Dashboard />}/>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/productinventory' element={<ProductInventory/>}/>
        <Route path='/vendorprofile' element={<VendorProfile/>}/>
        <Route path='/receivedorders' element={<ReceivedOrders/>}/>
        <Route path="/mydashboard/editproduct/:id" element={<EditProduct />} />
      </Routes>
    </div>
  )
}

export default App

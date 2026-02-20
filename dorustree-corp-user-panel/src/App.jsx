import { useContext, useState } from 'react'
// import './App.css'
import {Route, Routes} from 'react-router-dom';
import Home from './Pages/Home/Home'
import MenuBar from './Components/MenuBar/MenuBar';
import { StoreContext } from './Context/StoreContext';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ExploreProduct from './Pages/ExploreProduct/ExploreProduct';

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
      </Routes>
    </div>
  )
}

export default App

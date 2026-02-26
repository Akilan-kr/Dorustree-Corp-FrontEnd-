import React, { useContext, useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';
import { loginUser } from '../../Service/Authservice';

const Login = () => {

    const navigate = useNavigate();

    const {setUser} = useContext(StoreContext);


    const [data, setData] = useState({
        userName:'',
        password:''
    });

   const onChangeHandler = (Event) => {
        const name = Event.target.name;
        const value = Event.target.value;
        setData(data => ({...data, [name]: value}));
   };

   useEffect(() =>{
                   const storedUser = localStorage.getItem("user");
                   if (storedUser) {
                       navigate("/");
                   }
       }, []);

   

   const onsubmitHandler = async(Event) => {
    Event.preventDefault();
    // console.log("data",data);
    try {
        const response = await loginUser(data);
        console.log(response)
        if(response.status === 202){
            toast.success('Logged In succuessfully');
            setUser({
                token: response.data.data.token,
                email: response.data.data.email,
                role: response.data.data.userRole
                });
            localStorage.setItem("user", JSON.stringify(response.data.data));
            
            navigate("/");
        } else {
            toast.error('Please check your password and login.')
        }
    } catch (error) {
        toast.error('Unable to login, Please try again.')
        console.log('Error while login:', error)
    }

   };

  return (
    <div className="login-container">
    <div className="row justify-content-center">
        <div className="col-md-6">
            <div className="card mt-4">
                <div className="card-body">
                    <h3 className="card-title text-center">Admin Login</h3>                  
                    <form onSubmit={onsubmitHandler}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" placeholder='example@gmail.com' name='userName' onChange={onChangeHandler} value={data.userName} required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" placeholder='password123' name='password' onChange={onChangeHandler} value={data.password} required/>
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-outline-primary">Login</button>
                        </div>
                        <div className="d-grid mt-2">
                            <button type="reset" className="btn btn-outline-danger">Reset</button>
                        </div>
                    </form>
                    <div className="text-center mt-3">
                        <div className='mt-4'>Don't have an account?  <Link to='/login' className='text-decoration-none'>Sign up</Link></div>
                        <a href="#" className="text-decoration-none">Forgot password?</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default Login;
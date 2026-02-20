import React, { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { registerUser } from '/src/Services/Authservice.js';

const Register = () => {
  const [data, setData] = useState({
    userName:'',
    userEmail:'',
    userPassword:'',
    userAddress:'',
    userPhone:''
  });

  const navigate = useNavigate();

  const [confirmPassword, setconfirmPassword] = useState('');

  const onChangeHandler = (Event) => {
    const name = Event.target.name;
    const value = Event.target.value;
    setData(data => ({...data, [name]: value}));
  };
  
  const onChangeHandlerForPassword = (Event) =>{
    setconfirmPassword(Event.target.value);
  }

  const onSubmitHandler = async(Event) => {
    Event.preventDefault();

    // console.log(data);
    // console.log(confirmPassword);
    if(data.userPassword === confirmPassword){
        try {
            const response = await registerUser(data);
            if(response.status === 201){
                // console.log(data)
                toast.success('Registration completed, Please Login');
                navigate("/login");
            }
            else{
                toast.error('Unable to Register, Please Try again.');
            }

        } catch (error) {
            toast.error('Unable to Register, Please Try again.', error);
        }
    } else{
        toast.error('Check! - Password and ConfirmPassword is not same');
    }
  };



  return (
<div className="register-container">
    <div className="row justify-content-center">
        <div className="col-md-6">
            <div className="card mt-4">
                <div className="card-body">
                    <h3 className="card-title text-center">Register</h3>                  
                    <form onSubmit={onSubmitHandler}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="text" placeholder='username' name='userName' onChange={onChangeHandler} value={data.userName} required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" placeholder='example@gmail.com' name='userEmail' onChange={onChangeHandler} value={data.userEmail} required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">address</label>
                            <input type="text" className="form-control" id="address" placeholder='1, street, district - 620000' name='userAddress' onChange={onChangeHandler} value={data.userAddress} required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input type="text" className="form-control" id="phone" placeholder='9876543210' name='userPhone' onChange={onChangeHandler} value={data.userPhone} required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" placeholder='password123' name='userPassword' onChange={onChangeHandler} value={data.userPassword}  required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="confirm-password" placeholder='password123' name='confirmPassword' onChange={onChangeHandlerForPassword} value={confirmPassword} required/>
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-outline-primary">Register</button>
                        </div>
                        <div className="d-grid mt-2">
                            <button type="reset" className="btn btn-outline-danger">Reset</button>
                        </div>
                    </form>
                    <div className="text-center mt-3">
                        <div className='mt-4'>Already have an account?  <Link to='/login' className='text-decoration-none'>Sign in</Link></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    
  );
}

export default Register;
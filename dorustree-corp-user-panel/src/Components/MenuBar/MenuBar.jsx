import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import './MenuBar.css';
import { StoreContext } from '../../Context/StoreContext';
import { logoutUser } from '../../Services/Authservice';

const Menubar = () => {
  const [active, setActive] = useState("home");

  const {user, setUser, quantities, setQuantities} = useContext(StoreContext);

  const navigate = useNavigate();


//   const uniqueItemsInCart = Object.values(quantities).filter(qty => qty > 0).length;

  const logout = async(Event) => {
    try{
        const response = await logoutUser(user.token)
        if(response.status === 200){
            localStorage.removeItem('user');
        
            setUser({
                    email: "",
                    role: "",
                    token: ""
            })
            
            setQuantities({});
            navigate('/');
        }
    } catch (error){
        console.log(error);
    }
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid px-4">

        {/* Logo + Brand (Moved More Left) */}
        <div className="d-flex align-items-center">
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img 
              src={assets.logo} 
              alt="dorustree-logo" 
              height={48} 
              width={48} 
            />
            <span className="fw-bold fs-5 ms-2">Dorustree</span>
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">

          {/* Left Links */}
          <ul className="navbar-nav ms-4 me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={active === 'home' ? "nav-link fw-bold active" : "nav-link"} 
                to="/" 
                onClick={() => setActive("home")}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                className={active === 'explore' ? "nav-link fw-bold active" : "nav-link"} 
                to="/explore" 
                onClick={() => setActive("explore")}
              >
                Explore Products
              </Link>
            </li>
          </ul>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-4 ms-auto">

            {/* Cart */}
            <Link to="/cart">
              <div className="position-relative">
                <img src={assets.cart} alt="" height={32} width={32} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"></span>
              </div>
            </Link>

            {/* Auth Section */}
            {!user.token ? (
              <>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>

                <button 
                  className="btn btn-outline-success"
                  onClick={() => navigate('/register')}
                >
                  Register
                </button>
              </>
            ) : (

              /* ✅ Improved Dropdown */
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2 dropdown-toggle border-0 bg-transparent"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ boxShadow: "none" }}
                >
                  {/* Avatar */}
                  <img
                    src={assets.userIcon}
                    alt="usericon"
                    width={32}
                    height={32}
                    className="rounded-circle"
                  />

                  {/* Email (Safe for Long Emails) */}
                  <span
                    style={{
                      maxWidth: "160px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "14px",
                      fontWeight: "500"
                    }}
                    title={user.email}
                  >
                    {user.email}
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow">

                  {user.userRole === "USER" ? (
                    <>
                      <li>
                        <button 
                          className="dropdown-item"
                          onClick={() => navigate('/myorders')}
                        >
                          Orders
                        </button>
                      </li>

                      <li>
                        <button 
                          className="dropdown-item"
                          onClick={() => navigate('/becamevendor')}
                        >
                          Become Vendor
                        </button>
                      </li>

                      <li>
                        <button 
                          className="dropdown-item text-danger"
                          onClick={logout}
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <button 
                          className="dropdown-item"
                          onClick={() => navigate('/vendorprofile')}
                        >
                          Vendor Dashboard
                        </button>
                      </li>

                      <li>
                        <button 
                          className="dropdown-item text-danger"
                          onClick={logout}
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  )}

                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>

  )
}

export default Menubar;
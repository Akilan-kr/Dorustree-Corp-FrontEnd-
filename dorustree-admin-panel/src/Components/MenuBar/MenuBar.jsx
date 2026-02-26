import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { logoutUser } from '../../Service/Authservice';
import { assets } from '../../assets/assets';
import 'bootstrap/dist/css/bootstrap.min.css';

const Menubar = () => {

  const { user, setUser } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await logoutUser(user.token);
      if (response.status === 200) {
        localStorage.removeItem('user');
        setUser({
          email: "",
          role: "",
          token: ""
        });
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid px-3">

        {/* Logo - pushed slightly left */}
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img 
              src={assets.logo} 
              alt="dorustree-logo" 
              height={48} 
              width={48} 
            />
            <span className="fw-bold fs-5 ms-2">Dorustree</span>
          </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">

          {/* Push everything right */}
          <div className="ms-auto d-flex align-items-center gap-4">

            {!user.token ? (
              <>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/register')}
                >
                  Register
                </button>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2 dropdown-toggle border-0 bg-transparent"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ boxShadow: "none" }}
                >
                  <img
                    src={assets.userIcon}
                    alt="user"
                    width={32}
                    height={32}
                    className="rounded-circle"
                  />

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
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>

  );
};

export default Menubar;

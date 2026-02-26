import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt,
  FaUsers,
  FaBoxes,
  FaClipboardList
} from "react-icons/fa";


function DashboardSidebar() {
  const location = useLocation();

  const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
  { label: 'All Users', path: '/allusers', icon: <FaUsers /> },
  { label: 'Product Inventory', path: '/productinventory', icon: <FaBoxes /> },
  { label: 'All Orders Details', path: '/orders', icon: <FaClipboardList /> }

    // { label: 'Previous Orders', path: '/previousorders', icon: <FaHistory /> }
  ];

  return (
    <div style={{ width: '240px', backgroundColor: '#2c3e50', minHeight: '100vh', padding: '20px' }}>
      
      {/* Optional Title */}
      {/* <h4 style={{ 
        color: '#fff', 
        textAlign: 'center', 
        marginBottom: '30px',
        letterSpacing: '1px'
      }}>
        Vendor Dashboard
      </h4> */}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={item.path} style={{ marginBottom: '12px' }}>
              <Link
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#2c3e50' : '#ecf0f1',
                  backgroundColor: isActive ? '#ecf0f1' : 'transparent',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <span style={{ fontSize: '16px' }}>
                  {item.icon}
                </span>
                <span style={{ whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default DashboardSidebar;

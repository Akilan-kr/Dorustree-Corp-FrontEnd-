import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function DashboardSidebar() {
  const location = useLocation(); // Get current URL path
  const [activeTab, setActiveTab] = useState(location.pathname); // Initialize from URL

  const menuItems = [
    { label: 'Vendor Profile', path: '/vendorprofile' },
    { label: 'Add Product', path: '/addproduct' },
    { label: 'Product Inventory', path: '/productinventory' },
    { label: 'Received Orders', path: '/receivedorders' }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '18px', marginBottom: '30px', textAlign: 'center' }}>Vendor Dashboard</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.path;
            return (
              <li key={item.path} style={{ marginBottom: '10px' }}>
                <Link
                  to={item.path}
                  onClick={() => setActiveTab(item.path)}
                  style={{
                    display: 'block',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    color: '#ecf0f1',
                    border: isActive ? '2px solid #fff' : '2px solid transparent',
                    fontWeight: isActive ? 'bold' : 'normal',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default DashboardSidebar;

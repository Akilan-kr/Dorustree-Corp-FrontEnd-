
import React, { useState } from 'react';
import AddProduct from '../../Components/AddProducts/AddProducts';
// import DashboardSideBar from '../../Components/DashboardSideBar/DashboardSideBar';
// import RequestVendor from './RequestVendor'; // your component

function Dashboard() {
 
    const [activeTab, setActiveTab] = useState('profile');
    
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '220px', backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '30px' }}>Vendor Dashboard</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'profile' ? '#34495e' : 'transparent',
              borderRadius: '4px'
            }}
          > Profile
            
          </li>
          <li
            onClick={() => setActiveTab('add product')}
            style={{
              padding: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'add product' ? '#34495e' : 'transparent',
              borderRadius: '4px'
            }}
          >
            Add Product
          </li>
                    <li
            onClick={() => setActiveTab('list product')}
            style={{
              padding: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'list product' ? '#34495e' : 'transparent',
              borderRadius: '4px'
            }}
          >
            Product Inventory
          </li>
          <li
            onClick={() => setActiveTab('order')}
            style={{
              padding: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'order' ? '#34495e' : 'transparent',
              borderRadius: '4px'
            }}
          > 
            Order
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px', backgroundColor: '#ecf0f1', overflowY: 'auto' }}>
        {activeTab === 'profile'}
        {activeTab === 'add product' && <AddProduct/>}
        {activeTab === 'order' && <div><h3>Profile Section</h3><p>User profile info here.</p></div>}
      </div>
    </div>
  );
}

export default Dashboard;

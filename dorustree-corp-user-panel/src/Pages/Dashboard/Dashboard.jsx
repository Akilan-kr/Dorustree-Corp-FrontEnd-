
import React, { useState } from 'react';
import DashboardSideBar from '../../Components/DashboardSideBar/DashboardSideBar';
// import RequestVendor from './RequestVendor'; // your component

function Dashboard() {
  const [activeTab, setActiveTab] = useState('VENDOR');

  return (
    <DashboardSideBar/>
  );
}

export default Dashboard;

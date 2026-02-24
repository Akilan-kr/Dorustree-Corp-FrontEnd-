import React from 'react'
import DashboardSidebar from '../DashboardSidebar/DashboardSidebar'

function VendorProfile() {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', flexShrink: 0 }}>
        <DashboardSidebar />
      </div>
    <div>VendorProfile</div>
    </div>
  )
}

export default VendorProfile;
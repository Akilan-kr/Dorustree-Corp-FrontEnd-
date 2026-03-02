import React, { useContext, useEffect, useState } from "react";
import DashboardSidebar from "../../Components/DashboardSidebar/DashboardSidebar";
import { getLoggedInUser, getVendorStats } from "../../Services/UserService";
import { StoreContext } from "../../Context/StoreContext";
import { FaBoxOpen, FaShoppingCart, FaDollarSign } from "react-icons/fa";

function VendorProfile() {
  const [currentUser, setCurrentUser] = useState(null);
  const { user } = useContext(StoreContext);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (user?.token) {
      fetchUser();
      fetchStats();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const response = await getLoggedInUser(user.token);
      setCurrentUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchStats = async () => {
    try{
      const response = await getVendorStats(user.token);
      console.log("stats:",response)
      setStats({
        totalProducts: response.data.data.totalProducts,
        totalSales: response.data.data.totalSalesQuantity,
        revenue: response.data.data.totalSalesAmount
      });
    } catch (error){
      console.log("error while fetch vendor stats", error);
    }

  };

  const getStatusColor = (status) => {
    if (status === "APPROVED") return "#16a34a";
    if (status === "PENDING") return "#f59e0b";
    return "#6b7280";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", flexShrink: 0, background: "#2c3e50" }}>
        <DashboardSidebar />
      </div>

      <div style={{ flex: 1, padding: "40px" }}>
        <h2 style={{ marginBottom: "30px", fontWeight: "600" }}>
          Vendor Profile
        </h2>

        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              flex: "1 1 200px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            <FaBoxOpen size={30} />
            <div>
              <p style={{ fontSize: "14px", margin: 0 }}>Total Products</p>
              <h2 style={{ margin: 0 }}>{stats.totalProducts}</h2>
            </div>
          </div>

          <div
            style={{
              flex: "1 1 200px",
              background: "#16a34a",
              color: "#fff",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            <FaShoppingCart size={30} />
            <div>
              <p style={{ fontSize: "14px", margin: 0 }}>Total Sales</p>
              <h2 style={{ margin: 0 }}>{stats.totalSales}</h2>
            </div>
          </div>

          <div
            style={{
              flex: "1 1 200px",
              background: "#f59e0b",
              color: "#fff",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            <FaDollarSign size={30} />
            <div>
              <p style={{ fontSize: "14px", margin: 0 }}>Revenue ($)</p>
              <h2 style={{ margin: 0 }}>{stats.revenue}</h2>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        {currentUser && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "40px 30px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
              width: "100%",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ margin: 0, fontSize: "28px" }}>{currentUser.userName}</h3>
              <p style={{ color: "#6b7280", marginTop: "5px" }}>
                {currentUser.userEmail}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "25px",
                marginBottom: "40px",
              }}
            >
              <div>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>Role</p>
                <p style={{ fontWeight: "500" }}>{currentUser.userRoles}</p>
              </div>

              <div>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>Status</p>
                <span
                  style={{
                    background: getStatusColor(currentUser.userStatusForVendor),
                    color: "#fff",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "13px",
                  }}
                >
                  {currentUser.userStatusForVendor}
                </span>
              </div>

              <div>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>Phone</p>
                <p style={{ fontWeight: "500" }}>
                  {currentUser.userPhone || "Not Provided"}
                </p>
              </div>

              <div>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>Address</p>
                <p style={{ fontWeight: "500" }}>
                  {currentUser.userAddress || "Not Provided"}
                </p>
              </div>
            </div>

            {/* Centered Edit Button */}
            <div style={{ textAlign: "center" }}>
              <button
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "15px",
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorProfile;

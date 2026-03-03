import React, { useEffect, useState, useContext } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { StoreContext } from "../../Context/StoreContext";
import { FaUsers, FaBoxes, FaClipboardList, FaDollarSign, FaUserClock } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboardStats } from "../../Service/AdminDashboardService";
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
  const { user } = useContext(StoreContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats(user.token);
        setStats(data);
      } catch (err) {
        toast.error("Error while fetching Stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.token]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!stats) return <p>Error loading stats</p>;

  const userData = [
    { name: "Vendors", value: stats.totalVendors },
    // { name: "Over All Users", value: stats.totalUsers },
    { name: "User Request For Vendor", value: stats.pendingVendorRequests },
    { name: "Customers", value: stats.totalUsers - stats.totalVendors },
  ];

  const productData = [
    { name: "Active", value: stats.activeProducts },
    { name: "Inactive", value: stats.inactiveProducts },
  ];

  const formatCurrency = (amount) => `₹${amount.toLocaleString()}`;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Top Stats Cards */}
      <Row className="mb-4">
        {[
          { icon: <FaUsers size={28} />, title: "Total Users", value: stats.totalUsers, path: "/allusers"},
          { icon: <FaUserClock size={28} />, title: "Pending Vendor Requests", value: stats.pendingVendorRequests, path: "/userrequest" },
          { icon: <FaBoxes size={28} />, title: "Total Products", value: stats.totalProducts, path: "/productinventory" },
          { icon: <FaDollarSign size={28} />, title: "Total Revenue", value: formatCurrency(stats.revenueTotal) },
        ].map((card, idx) => (
          <Col key={idx} md={3} className="mb-3">
            <Card 
              className="shadow-sm text-center h-100 dashboard-card"
              style={{ cursor: card.path ? "pointer" : "default" }}
              onClick={() => card.path && navigate(card.path)} // navigate if path exists
            >
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <div className="mb-2">{card.icon}</div>
                <h4>{card.value}</h4>
                <p className="mb-0">{card.title}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


      {/* Pie Charts */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Users Breakdown</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={userData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Products Breakdown</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={productData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Orders & Revenue Today */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4 text-center">
            <Card.Body>
              <h5 className="mb-3">Orders</h5>
              <p>Total Orders: {stats.totalOrders}</p>
              <p>Completed Orders: {stats.completedOrders}</p>
              <p>Pending Orders: {stats.pendingOrders}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4 text-center">
            <Card.Body>
              <h5 className="mb-3">Revenue Today</h5>
              <h3>{formatCurrency(stats.revenueToday)}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Extra styling */}
      <style>
        {`
          .dashboard-card {
            transition: transform 0.2s;
          }
          .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 25px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;

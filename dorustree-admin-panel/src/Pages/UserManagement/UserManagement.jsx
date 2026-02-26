import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { Spinner, Table, Badge, Card, Row, Col, Button } from "react-bootstrap";
import { getAllUsers, deleteUser } from "../../Service/AdminService"; // assume you have a deleteUser API

function UserManagement() {
  const { user } = useContext(StoreContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    ADMIN: 0,
    VENDOR: 0,
    USER: 0,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(user.token);
      const data = response.data.data;

      setUsers(data);

      const adminCount = data.filter(u => u.userRole === "ADMIN").length;
      const vendorCount = data.filter(u => u.userRole === "VENDOR").length;
      const userCount = data.filter(u => u.userRole === "USER").length;

      setCounts({ ADMIN: adminCount, VENDOR: vendorCount, USER: userCount });

    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId, user.token);
      fetchUsers(); // refresh the table after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // lighter pastel colors
  const cardColors = {
    ADMIN: "#f8d7da",   // light red
    VENDOR: "#cce5ff",  // light blue
    USER: "#d4edda"     // light green
  };

  const textColors = {
    ADMIN: "#842029",
    VENDOR: "#004085",
    USER: "#155724"
  };

  return (
    <div className="container mt-4">

      <h3 className="mb-4">User Management</h3>

      {/* Cards Summary */}
      <Row className="mb-4 g-3">
        {["ADMIN", "VENDOR", "USER"].map((role) => (
          <Col md={4} key={role}>
            <Card className="shadow-sm" style={{ backgroundColor: cardColors[role], color: textColors[role] }}>
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                <Card.Title style={{color: textColors[role]}}>{role}s</Card.Title>
                <h2 style={{color: textColors[role]}}>{counts[role]}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Users Table */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm bg-white text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Vendor Status</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Created At</th>
              <th>Action</th> {/* new column for delete */}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((userItem, index) => (
                <tr key={userItem.id}>
                  <td>{index + 1}</td>
                  <td>{userItem.userName}</td>
                  <td>{userItem.userEmail}</td>
                  <td>
                    <Badge bg={userItem.userRole === "ADMIN" ? "danger" : userItem.userRole === "VENDOR" ? "primary" : "success"}>
                      {userItem.userRole}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg="secondary">
                      {userItem.userStatusForVendor}
                    </Badge>
                  </td>
                  <td>{userItem.userPhone}</td>
                  <td>{userItem.userAddress}</td>
                  <td>
                    {userItem.createdAt
                      ? new Date(userItem.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {userItem.userRole !== "ADMIN" && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteUser(userItem.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No Users Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default UserManagement;

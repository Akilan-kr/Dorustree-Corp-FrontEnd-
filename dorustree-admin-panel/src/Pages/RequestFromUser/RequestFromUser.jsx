import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { Table, Button, Spinner } from "react-bootstrap";
import {
  getUsersByVendorStatus,
  promoteUser
} from "../../Service/AdminService";
import { toast } from "react-toastify";

function RequestFromUser() {
  const { user } = useContext(StoreContext);

  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingUsers = async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      const res = await getUsersByVendorStatus(
        user.token,
        "Status_Pending"
      );
      setPendingUsers(res.data); // because ApiResponse wraps data
    } catch (err) {
      console.error("Error fetching pending users:", err);
      toast.error("Error while fetching request pending user");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, status) => {
    try {
      await promoteUser(user.token, userId, status);
      fetchPendingUsers();
      toast.success("User status is updated"); // refresh list
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Error while updating user status")
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchPendingUsers();
    }
  }, [user]);

  return (
    <div className="container mt-4">
      <h2>Vendor Requests (Pending)</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length > 0 ? (
              pendingUsers.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.userName}</td>
                  <td>{u.userEmail}</td>
                  <td>{u.userStatusForVendor}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="success"
                      className="me-2"
                      onClick={() =>
                        handleAction(u.id, "Status_Approved")
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        handleAction(u.id, "Status_Rejected")
                      }
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No pending requests
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default RequestFromUser;

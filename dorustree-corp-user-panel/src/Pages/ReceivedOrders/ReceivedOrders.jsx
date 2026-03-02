import React, { useEffect, useState, useContext } from "react";
import DashboardSidebar from "../../Components/DashboardSidebar/DashboardSidebar";
import { getVendorOrdersByStatus, updateOrderStatus } from "../../Services/OrderService";
import { getProductById } from "../../Services/ProductService";
import { StoreContext } from "../../Context/StoreContext";

function ReceivedOrders() {
  const { user } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await getVendorOrdersByStatus(user.token, "Order_Initiated");
      const vendorOrders = response.data;

      // Attach product details
      const enrichedOrders = await Promise.all(
        vendorOrders.map(async (order) => {
          const updatedItems = await Promise.all(
            order.orderedItems.map(async (item) => {
              const product = await getProductById(item.productId, user.token);
              return {
                ...item,
                productName: product.data.productName,
                productCategory: product.data.productCategory,
              };
            })
          );
          return { ...order, orderedItems: updatedItems };
        })
      );

      setOrders(enrichedOrders);
    } catch (error) {
      console.error("Failed to fetch vendor orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(user.token, orderId, newStatus);
      // Refresh orders after update
      await fetchOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", flexShrink: 0, background: "#2c3e50" }}>
        <DashboardSidebar />
      </div>

      <div style={{ flex: 1, padding: "40px" }}>
        <h2 style={{ marginBottom: "30px" }}>📦 Received Orders</h2>

        {loading && <p>Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <div
            style={{
              padding: "40px",
              background: "#fff",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <h4>No Orders Yet</h4>
            <p style={{ color: "#888" }}>
              When customers purchase your products, they will appear here.
            </p>
          </div>
        )}

        {!loading &&
          orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "25px",
                marginBottom: "25px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h4>Order #{order.id}</h4>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      background:
                        order.orderStatus === "Order_Initiated"
                          ? "#fff3cd"
                          : order.orderStatus === "Order_Confirmed"
                          ? "#d4edda"
                          : order.orderStatus === "Order_Cancel"
                          ? "#f8d7da"
                          : "#cce5ff",
                      color:
                        order.orderStatus === "Order_Initiated"
                          ? "#856404"
                          : order.orderStatus === "Order_Confirmed"
                          ? "#155724"
                          : order.orderStatus === "Order_Cancel"
                          ? "#721c24"
                          : "#004085",
                      fontSize: "13px",
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <h4 style={{ color: "#28a745" }}>₹ {order.totalPrice}</h4>
              </div>

              {/* Items */}
              {order.orderedItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px 0",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <div>
                    <h5 style={{ margin: 0 }}>{item.productName}</h5>
                    <small style={{ color: "#888" }}>
                      Category: {item.productCategory}
                    </small>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div>Qty: {item.productQuantity}</div>
                    <div>₹ {item.productPrice}</div>
                  </div>
                </div>
              ))}

              {/* Vendor Actions */}
              {order.orderStatus === "Order_Initiated" && (
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    gap: "15px",
                  }}
                >
                  <button
                    className="btn btn-success"
                    disabled={updatingOrderId === order.id}
                    onClick={() => handleStatusChange(order.id, "Order_Confirmed")}
                  >
                    {updatingOrderId === order.id ? "Updating..." : "Confirm Order"}
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={updatingOrderId === order.id}
                    onClick={() => handleStatusChange(order.id, "Order_Cancel")}
                  >
                    {updatingOrderId === order.id ? "Updating..." : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default ReceivedOrders;

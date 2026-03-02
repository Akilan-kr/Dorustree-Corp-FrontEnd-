import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { getUserOrders, updateOrderStatus } from "../../Services/OrderService";
import { getProductById } from "../../Services/ProductService";

function Order() {
  const { user } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders(user.token);
        const ordersData = response.data;

        const enrichedOrders = await Promise.all(
          ordersData.map(async (order) => {
            const enrichedItems = await Promise.all(
              order.orderedItems.map(async (item) => {
                const product = await getProductById(item.productId, user.token);
                return {
                  ...item,
                  productName: product.data.productName,
                  productCategory: product.data.productCategory,
                  productPrice: product.data.productPrice,
                  productQuantity: item.quantity || item.productQuantity,
                };
              })
            );
            return { ...order, orderedItems: enrichedItems };
          })
        );

        setOrders(enrichedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchOrders();
    }
  }, [user]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus( user.token, orderId, newStatus);

      // Update UI instantly
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Order_Initiated":
        return { background: "#fff3cd", color: "#856404" };
      case "Order_Confirmed":
        return { background: "#cce5ff", color: "#004085" };
      case "Order_Cancel":
        return { background: "#f8d7da", color: "#721c24" };
      case "Order_Received":
        return { background: "#d4edda", color: "#155724" };
      default:
        return {};
    }
  };

  if (loading) return <p>Loading your orders...</p>;
  if (!orders.length) return <p>You have no orders yet.</p>;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ marginBottom: "25px" }}>📦 My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h4 style={{ margin: 0 }}>Order #{order.id}</h4>

            <span
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "bold",
                ...getStatusStyle(order.orderStatus),
              }}
            >
              {order.orderStatus.replace("Order_", "").replace("_", " ")}
            </span>
          </div>

          {/* Items */}
          {order.orderedItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderTop: "1px solid #eee",
              }}
            >
              <div>
                <h5 style={{ margin: "0 0 5px 0" }}>{item.productName}</h5>
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

          <h4 style={{ textAlign: "right", marginTop: "15px" }}>
            Total: ₹ {order.totalPrice}
          </h4>

          {/* Action Buttons */}
          <div style={{ marginTop: "15px", textAlign: "right" }}>
            {order.orderStatus === "Order_Initiated" && (
              <button
                onClick={() =>
                  handleStatusUpdate(order.id, "Order_Cancel")
                }
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel Order
              </button>
            )}

            {order.orderStatus === "Order_Confirmed" && (
              <button
                onClick={() =>
                  handleStatusUpdate(order.id, "Order_Received")
                }
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Mark as Received
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Order;

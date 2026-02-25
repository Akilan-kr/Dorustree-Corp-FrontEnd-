import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { getUserOrders } from "../../Services/OrderService";
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
              productPrice: product.data.productPrice, // include price if needed
              productQuantity: item.quantity || item.productQuantity, // ensure quantity
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

  if (loading) return <p>Loading your orders...</p>;
  if (!orders.length) return <p>You have no orders yet.</p>;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h2>📦 My Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            <h4>Order #{order.id}</h4>
            <span
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                background:
                  order.orderStatus === "Order_Initiated" ? "#fff3cd" : "#d4edda",
                color:
                  order.orderStatus === "Order_Initiated" ? "#856404" : "#155724",
                fontSize: "13px",
              }}
            >
              {order.orderStatus}
            </span>
          </div>

          {order.orderedItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
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

          <h4 style={{ textAlign: "right", marginTop: "15px" }}>
            Total: ₹ {order.totalPrice}
          </h4>
        </div>
      ))}
    </div>
  );
}

export default Order;

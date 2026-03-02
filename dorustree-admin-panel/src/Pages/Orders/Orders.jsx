import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import { getAllOrders } from "../../Service/AdminOrdersService";
import { getProductById } from "../../Service/ProductService";
import { getUserById } from "../../Service/AdminService";


function Orders() {
  const { user } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState({}); // per-order loading
  const [orderProducts, setOrderProducts] = useState({}); // product info per order
  const [usersData, setUsersData] = useState({}); // user info cache



  // Fetch all orders
  const fetchOrders = async () => {
    if (!user?.token) {
      console.log("Token not ready yet");
      return;
    }

    console.log("TOKEN SENT:", user.token);

    setLoading(true);
    try {
      const data = await getAllOrders(user.token);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };


  const fetchOrderProducts = async (orderId, items, orderedUserId) => {
    setLoadingProducts(prev => ({ ...prev, [orderId]: true }));

    const productData = {};
    const userCache = { ...usersData };

    try {
      // 🔹 Fetch ordered user name
      if (!userCache[orderedUserId]) {
        const userRes = await getUserById(user.token, orderedUserId);
        userCache[orderedUserId] = userRes.data.data;
      }

      for (const item of items) {
        const productRes = await getProductById(item.productId, user.token);
        const product = productRes.data;

        productData[item.productId] = product;

        // 🔹 Fetch vendor name
        const vendorId = product.productVendorId;
        if (vendorId && !userCache[vendorId]) {
          const vendorRes = await getUserById(user.token, vendorId);
          userCache[vendorId] = vendorRes.data.data;
        }
      }

      setUsersData(userCache);
      setOrderProducts(prev => ({ ...prev, [orderId]: productData }));

    } catch (err) {
      console.error("Error fetching order details:", err);
    }

    setLoadingProducts(prev => ({ ...prev, [orderId]: false }));
  };


  // Expand/collapse order details
  const toggleExpand = (order) => {
    if (expandedOrderId === order.id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(order.id);
      fetchOrderProducts(
        order.id,
        order.orderedItems || [],
        order.orderedUserId
      );

    }
  };

    useEffect(() => {
      if (user?.token) {
        fetchOrders();
      }
    }, [user]);


  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Orders</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        orders.map((order, index) => (
          <Card key={order.id} className="mb-3 shadow-sm">
            <Card.Header
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => toggleExpand(order)}
            >
              <div>
                <strong>Order #{index + 1}</strong> — Total: ₹{order.totalPrice} — Status: {order.orderStatus}
              </div>
              <Button variant="outline-primary" size="sm">
                {expandedOrderId === order.id ? "Hide Details" : "Show Details"}
              </Button>
            </Card.Header>

            {expandedOrderId === order.id && (
              <Card.Body>
                          <p>
                          <strong>Ordered By:</strong>{" "}
                          {usersData[order.orderedUserId]
                            ? usersData[order.orderedUserId].userName
                            : "Loading..."}
                        </p>

                {loadingProducts[order.id] ? (
                  <div className="text-center">
                    <Spinner animation="border" size="sm" variant="primary" />
                  </div>
                ) : (
                  <Table striped bordered hover responsive size="sm">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Vendor ID</th>
                        <th>Quantity</th>
                        <th>Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderedItems && order.orderedItems.length > 0 ? (
                        order.orderedItems.map((item, idx) => {
                          const product = orderProducts[order.id]?.[item.productId];
                          return (
                            <tr key={idx}>
                              <td>{idx + 1}</td>
                              <td>{product ? product.productName : "Loading..."}</td>
                              <td>
                                {product && usersData[product.productVendorId]
                                  ? usersData[product.productVendorId].userName
                                  : "Loading..."}
                              </td>

                              <td>{item.productQuantity}</td>
                              <td>{item.productPrice}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">No items in this order</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            )}
          </Card>
        ))
      )}
    </div>
  );
}

export default Orders;

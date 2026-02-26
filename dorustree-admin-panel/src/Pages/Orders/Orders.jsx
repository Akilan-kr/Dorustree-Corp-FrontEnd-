import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { Card, Button, Table, Spinner } from "react-bootstrap";
import { getAllOrders } from "../../Service/AdminOrdersService";
import { getProductById } from "../../Service/ProductService";

function Orders() {
  const { user } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState({}); // per-order loading
  const [orderProducts, setOrderProducts] = useState({}); // product info per order

  // Fetch all orders
  const fetchOrders = async () => {
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

  // Fetch product info for a specific order
  const fetchOrderProducts = async (orderId, items) => {
    setLoadingProducts(prev => ({ ...prev, [orderId]: true }));

    const productData = {};
    for (const item of items) {
      try {
        const product = await getProductById(item.productId, user.token);
        productData[item.productId] = product.data;
        console.log(product.data) // <-- use returned object directly
      } catch (err) {
        productData[item.productId] = { productName: "Unknown", vendorId: "Unknown" };
      }
    }

    setOrderProducts(prev => ({ ...prev, [orderId]: productData }));
    setLoadingProducts(prev => ({ ...prev, [orderId]: false }));
  };

  // Expand/collapse order details
  const toggleExpand = (order) => {
    if (expandedOrderId === order.id) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(order.id);
      fetchOrderProducts(order.id, order.orderedItems || []);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
                <p><strong>Ordered By User ID:</strong> {order.orderedUserId}</p>

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
                              <td>{product ? product.productVendorId || "N/A" : "Loading..."}</td>
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

import React, { useEffect, useState, useContext } from "react";
import { clearUserCart, getCartData} from "../../Services/CartService";
import { getProductById } from "../../Services/ProductService";
import { StoreContext } from "../../Context/StoreContext";
import { placeOrder } from "../../Services/OrderService";

function Cart() {
  const { user, increaseQuantity, decreaseQuantity } = useContext(StoreContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch full cart details
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        if (!user.token) return;

        const cartData = await getCartData(user.token); // { productId: qty }

        const items = await Promise.all(
          Object.entries(cartData).map(async ([productId, quantity]) => {
            const product = await getProductById(productId, user.token);
            return {
              productId,
              productName: product.data.productName,
              productPrice: product.data.productPrice,
              quantity
            };
          })
        );

        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartDetails();
  }, [user.token]);

  // Handle increase/decrease
  const handleIncrease = async (productId) => {
    await increaseQuantity(productId); // updates backend and StoreContext
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = async (productId) => {
    await decreaseQuantity(productId);
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  if (loading) return <p>Loading cart...</p>;
  if (cartItems.length === 0)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "200px",
        backgroundColor: "#f8f9fa",
        border: "1px dashed #ccc",
        borderRadius: "10px",
        color: "#555",
        fontSize: "18px",
        fontWeight: "500",
        margin: "50px auto",
        maxWidth: "400px",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <span style={{ fontSize: "50px", marginBottom: "15px", color: "#6c757d" }}>🛒</span>
      Your cart is empty
      <small style={{ display: "block", marginTop: "10px", color: "#888", fontWeight: "400" }}>
        Browse products and add items to your cart
      </small>
    </div>
  );


  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

    const handlePlaceOrder = async () => {
      try {
        const orderRequest = {
          orderedItems: cartItems.map(item => ({
            productId: item.productId,
            productQuantity: item.quantity
          }))
        };

        console.log("Sending order:", orderRequest);

        await placeOrder(orderRequest, user.token);

        alert("Order placed successfully!");

        // ✅ Clear cart in backend
        await clearUserCart(user.token);

        // ✅ Clear UI
        setCartItems([]);


      } catch (error) {
        console.error("Order failed:", error);
        alert("Failed to place order");
      }
  };


  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>Your Cart</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Product</th>
            <th style={{ textAlign: "center", padding: "8px" }}>Price</th>
            <th style={{ textAlign: "center", padding: "8px" }}>Quantity</th>
            <th style={{ textAlign: "center", padding: "8px" }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.productId} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px" }}>{item.productName}</td>
              <td style={{ textAlign: "center", padding: "8px" }}>{item.productPrice}</td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                <div className="d-flex align-items-center gap-2 justify-content-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDecrease(item.productId)}
                  >
                    -
                  </button>
                  <span className="fw-bold">{item.quantity}</span>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleIncrease(item.productId)}
                  >
                    +
                  </button>
                </div>
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                {item.productPrice * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4 style={{ textAlign: "right", marginTop: "15px" }}>Total: {totalPrice}</h4>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          width: "100%",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px"
        }}
        onClick={handlePlaceOrder}

      >
        Place Order
      </button>
    </div>
  );
}

export default Cart;

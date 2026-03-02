// AdminOrdersService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/order";

/**
 * Get all orders (ADMIN)
 * @param {string} token - JWT token
 * @returns {Promise<Array>} list of orders
 */
export const getAllOrders = async (token) => {
  console.log(token);
  try {
    const res = await axios.get(`${API_URL}/getallorders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw err;
  }
};

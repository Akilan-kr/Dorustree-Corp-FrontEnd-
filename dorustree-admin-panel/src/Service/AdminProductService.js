// src/Service/AdminProductService.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/product";

/**
 * Get products by vendor ID (Admin)
 * @param {string} vendorId
 * @param {number} page
 * @param {number} size
 * @param {string} token
 * @returns {Promise<AxiosResponse>}
 */
export const getProductsByVendor = async (vendorId, page = 0, size = 10, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/getproducts/${vendorId}?page=${page}&size=${size}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching products by vendor:", error.response || error.message);
    throw error;
  }
};

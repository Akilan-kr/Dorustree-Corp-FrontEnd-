// src/Services/ProductService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/product";
const PAGE_SIZE = 10; // default page size, can be overridden

/**
 * Fetch products from backend with optional pagination and search
 * @param {number} page - Page number (starts from 0)
 * @param {string} searchTerm - Optional search string
 * @param {number} size - Optional page size
 * @returns {Promise<Array>} List of products
 */

//for user
export const fetchProductList = async (page = 0, searchTerm = "", size = PAGE_SIZE) => {
    try {
        const response = await axios.get(`${API_URL}/getproducts?page=${page}&size=${size}&search=${searchTerm}`);
        return response.data; // backend returns List<Product>
    } catch (error) {
        console.error("Error while fetching products:", error);
        throw error;
    }
};

//for vendor
export const addProduct = async(product, token) => {
    try {
        const response = await axios.post(`${API_URL}/addproduct`, product, {
            headers : {
                Authorization:  `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};
//for vendor
export const addProductsFromExcel = async(formData, token) => {
    try{
        const response = await axios.post(`${API_URL}/upload-excel`, formData,
            {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }
        );
        return response;
    } catch (error) {
        throw error;
    }

};


  // Fetch vendor products
 export const getVendorProducts = async (page = 0, size = 10, token) => {
    const res = await axios.get(`${API_URL}/getproductsofloginvendor?page=${page}&size=${size}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data; // adjust if your API wraps response
  };

  // Toggle product status (ACTIVE / INACTIVE)
    export const toggleProductStatus = async (productId, token) => {
        const res = await axios.put(
            `${API_URL}/statusofproduct/${productId}`,
            {}, 
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );
        return res.data;
    };


  // Delete product
 export const deleteProduct = async (productId, token) => {
    const res = await axios.delete(`${API_URL}/deleteproduct/${productId}` ,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    return res.data;
  };

  // Get product by ID
    export const getProductById = async (productId, token) => {
    const res = await axios.get(
        `${API_URL}/getproduct/${productId}`, 
        {
        headers: {
            Authorization: `Bearer ${token}`
        }
        }
    );
    return res.data;
    };


// Update product
    export const updateProduct = async (productId, productData, token) => {
    const res = await axios.put(
        `${API_URL}/updateproduct/${productId}`,
        productData,
        {
        headers: {
            Authorization: `Bearer ${token}`
        }
        }
    );
    return res.data;
    };


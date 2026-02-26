import axios from "axios";

const BASE_URL = "http://localhost:8080/api/users"; 
// 🔁 Change this if your backend runs on another port

/**
 * Get All Users (ADMIN only)
 * @param {string} token - JWT token
 * @returns {Promise}
 */
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/getusers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response;

  } catch (error) {
    console.error("Error in getAllUsers API:", error.response || error.message);
    throw error;
  }
};

/**
 * Delete a user by ID (ADMIN only)
 * @param {string} userId - ID of the user to delete
 * @param {string} token - JWT token
 * @returns {Promise}
 */
export const deleteUser = async (userId, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/deleteuser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response;

  } catch (error) {
    console.error("Error in deleteUser API:", error.response || error.message);
    throw error;
  }
};




 export const getUserById = async (token, userId) => {
    const res = await axios.get(`${API_URL}/getuser/${userId}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res)
    return res; 
  };

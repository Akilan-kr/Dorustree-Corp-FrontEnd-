import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/dashboard";

export const getDashboardStats = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    throw err;
  }
};

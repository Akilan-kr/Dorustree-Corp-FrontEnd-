import axios from "axios";

const API_URL = "http://localhost:8080/api/users";


 export const getLoggedInUser = async (token) => {
    const res = await axios.get(`${API_URL}/getuser`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res)
    return res; 
  };

export const getVendorStats = async (token) => {
    const res = await axios.get(`${API_URL}/vendor/stats`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(res)
    return res; 
};
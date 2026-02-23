import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users'; // adjust if your backend URL differs

export const requestVendor = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/requesttobecamevendor`, null, {
    headers : { 
        Authorization: `Bearer ${token}` 
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Something went wrong';
  }
};


export const getUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getuser`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Return only the data, not the whole Axios response
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error fetching user';
  }
};

import axios from "axios";

const API_URL = "http://localhost:8080/api/users/";

export const registerUser = async(data) => {
    try {
        const response = await axios.post(API_URL + "register", data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const loginUser =  async(data) => {
    try {
        const response = await axios.post(API_URL + "login", data);
        console.log(data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const logoutUser = async (token) => {
  try {
    // console.log(token);
    // console.log(API_URL + "logout");

    const response = await axios.post(API_URL + "logout", {},{headers: { Authorization: `Bearer ${token}` }});

    return response;
  } catch (error) {
    console.log(error.response || error);
  }
}
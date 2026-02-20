import axios from "axios";

const API_URL = "http://localhost:8080/api/product/getproducts";

export const fetchProductList = async() => {

    try {
        const response = await axios.get(API_URL);
        console.log(response);
        return response.data;
    // console.log(response.data);
    } catch (error) {
        console.log('Error while fetching products:',error);
        throw error;
    }
    
};
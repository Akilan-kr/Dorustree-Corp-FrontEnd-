import axios from "axios";

const API_URL = 'http://localhost:8080/api/cart/';

export const addToCart = async (productId, token) => {
    try {
        console.log(productId);
        await axios.post(
            API_URL + "addtocart",
            { 
                items: { [String(productId)]: 1 }   // always send 1
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.log('Error while adding item to cart:', error);
        throw error;
    }
};


export const removeQuantityFromCart = async(productId, token) =>{
    try {
        console.log(productId);
        await axios.post(
            API_URL + "removefromcart",
            { 
                items: { [String(productId)]: 1 }   // always send 1
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.log('Error while adding item to cart:', error);
        throw error;
    }
}

export const getCartData = async(token) =>{
    try {
        // console.log(token)
        const response = await axios.get(API_URL + "getcart",{headers: { Authorization: `Bearer ${token}` }});

        return response.data.items
    } catch (error) {
        console.log('Error fetching the cart data:', error);
        throw error;
    }
}

export const clearUserCart = async(token) => {
    try {
        await axios.delete(API_URL + "deletecart", {headers: {'Authorization': `Bearer ${token}`}});
    } catch (error) {
        throw error;
    }
}


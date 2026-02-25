import axios from "axios";

const API_URL = 'http://localhost:8080/api/order/';
    export const placeOrder = async (orderData, token) => {
        return await axios.post(
            API_URL + "placeorder",
            orderData,
            {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
            }
        );
    };

    export const getVendorOrdersByStatus = async (token, status) => {
        return await axios.get(API_URL + "getallorderbyorderstatus/" + status ,{
            headers: {
            Authorization: `Bearer ${token}`
            }
        });
    };

    export const updateOrderStatus = async (token, orderId, status) => {
        return await axios.put(
            API_URL + "updateorderstatus/" + orderId + "/" + status,
            {}, // empty body
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    };

    export const getUserOrders = async (token) => {
        try {
            return await axios.get(API_URL + "getorder", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
        } catch (error) {
            throw error;
        }
    };

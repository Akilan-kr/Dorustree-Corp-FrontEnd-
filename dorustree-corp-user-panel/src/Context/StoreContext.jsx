import { createContext, useEffect, useState } from "react";
// import { fetchFoodPowderList } from "../Service/foodService";
import { addToCart, getCartData, removeQuantityFromCart } from "/src/Services/CartService.js";
import { fetchProductList } from "../Services/ProductService";
// import { fetchCategoryList } from "../Service/CategoryService";


export const StoreContext = createContext(null);

export const StoreContextProvider = (props) =>{

    const [productList, setProductList] = useState([]);

    const [cart, setCart] = useState({
        items: {}
    });
    // const [categoryList, setCategoryList] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [user, setUser] = useState({
    email: "",
    role: "",
    token: ""
    });


    // to make quantity used in the entire app we placed it in the storecontext 
    const increaseQuantity = async (foodId) => {

        setCart(prev => {
            const updatedItems = {
            ...prev.items,
            [foodId]: (prev.items[foodId] || 0) + 1
            };

            return { items: updatedItems };
        });

        await addToCart({
            items: {
            [foodId]: (cart.items[foodId] || 0) + 1
            }
        }, user.token);
    };


    const decreaseQuantity = async (foodId) => {

        setCart(prev => {

            const currentQty = prev.items[foodId] || 0;

            if (currentQty <= 1) {
            const updated = { ...prev.items };
            delete updated[foodId];
            return { items: updated };
            }

            return {
            items: {
                ...prev.items,
                [foodId]: currentQty - 1
            }
            };
        });

        await removeQuantityFromCart({
            items: {
            [foodId]: (cart.items[foodId] || 1) - 1
            }
        }, user.token);
    };


    const removeFromCart = async (foodId) => {

        setCart(prev => {
            const updated = { ...prev.items };
            delete updated[foodId];
            return { items: updated };
        });

        await removeFromCartApi(foodId, user.token);
    };


    const loadCartData = async(token) => {
        const items = await getCartData(token);
        setQuantities(items);
        console.log(items);
    }


    const contextValue = {
        productList,
        // categoryList,
        increaseQuantity,
        decreaseQuantity,
        setQuantities,
        removeFromCart,
        quantities,
        user,
        setUser,
        // loadCartData
    };



    useEffect(() =>{
        async function loadData(){
            const data = await fetchProductList();
            setProductList(data);
            console.log(data);
    //         const category = await fetchCategoryList();
    //         setCategoryList(category);
    //         // console.log(data);

                const storedUser = localStorage.getItem("user:");
                // console.log(storedUser);

                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);

                    setUser(parsedUser);
                    loadCartData(parsedUser.token);
                    // console.log(parsedUser.token)
                    
                }
    //             
                
            
        }
        loadData();
    }, []);

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
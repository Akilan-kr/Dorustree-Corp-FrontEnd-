import { createContext, useEffect, useState } from "react";
import { addToCart, getCartData, removeQuantityFromCart } from "/src/Services/CartService.js";
import { fetchProductList } from "../Services/ProductService";


export const StoreContext = createContext(null);

export const StoreContextProvider = (props) =>{

    const pageSize = 10;
    const [productList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // backend starts at 0
    const [hasNextPage, setHasNextPage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const [cartDetails, setCartDetails] = useState([]);

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
    const increaseQuantity = async (productId) => {
        setQuantities((prev) => ({...prev,[productId]: (prev[productId] || 0)+1}));
        // Optimistic update
        setCart(prev => {
            const updatedItems = {
                ...prev.items,
                [productId]: (prev.items[productId] || 0) + 1
            };

            return { items: updatedItems };
        });

        // Backend only needs +1
        await addToCart(productId, user.token);
    };



    const decreaseQuantity = async (productId) => {
        setQuantities((prev) => ({...prev,[productId]: (prev[productId] || 0)-1}));

        setCart(prev => {
            const currentQty = prev.items[productId] || 0;

            if (currentQty <= 1) {
                const updated = { ...prev.items };
                delete updated[productId];
                return { items: updated };
            }

            return {
                items: {
                    ...prev.items,
                    [productId]: currentQty - 1
                }
            };
        });

        await removeQuantityFromCart(productId, user.token);
    };


    // const removeFromCart = async (productId) => {

    //     setCart(prev => {
    //         const updated = { ...prev.items };
    //         delete updated[productId];
    //         return { items: updated };
    //     });

    //     await removeFromCartApi(productId, user.token);
    // };


    const loadCartData = async (token) => {
    try {
        const items = await getCartData(token); // { productId: quantity }
        
        setQuantities(items); // for quick increment/decrement

        // Fetch product details for all cart items
        const productIds = Object.keys(items);
        if (productIds.length === 0) {
        setCartDetails([]);
        return;
        }

        const response = await fetchProductList(0, "", productIds); 
        // assuming your API can accept productIds and return their details

        const detailedCart = response.data.map(product => ({
        ...product,
        quantity: items[product.productId] || 0
        }));

        setCartDetails(detailedCart);
    } catch (error) {
        console.error("Error loading cart data:", error);
    }
    };


   const fetchProducts = async (page = 0, searchTerm = "") => {
    try {
        setLoading(true);
        const response = await fetchProductList(page, searchTerm);
        // console.log(response);
        setProductList(response.data);
        setCurrentPage(page);
        setHasNextPage(response.data.length === pageSize); // disable next page if less than pageSize
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        setLoading(false);
    }
};




    const contextValue = {
        productList,
        // categoryList,
        increaseQuantity,
        decreaseQuantity,
        setQuantities,
        // removeFromCart,
        hasNextPage,
        quantities,
        user,
        setUser,
        fetchProducts,
        currentPage,
        setCurrentPage,
        loading,
        search,
        setSearch,
        loadCartData
    };



    useEffect(() =>{
        async function loadData(){
            await fetchProducts(0, search);

                const storedUser = localStorage.getItem("user");
                // console.log(storedUser);

                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);

                    setUser(parsedUser);
                    loadCartData(parsedUser.token);
                    // console.log(parsedUser.token)
                    
                }           
        }
        loadData();
    }, []);

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
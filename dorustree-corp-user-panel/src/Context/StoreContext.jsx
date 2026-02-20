import { createContext, useEffect, useState } from "react";
// import { fetchFoodPowderList } from "../Service/foodService";
import { addToCart, getCartData, removeQuantityFromCart } from "/src/Services/CartService.js";
import { fetchProductList } from "../Services/ProductService";
import axios from "axios";
// import { fetchCategoryList } from "../Service/CategoryService";


export const StoreContext = createContext(null);

export const StoreContextProvider = (props) =>{

    const pageSize = 10;
    const [productList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // backend starts at 0
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

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
        setQuantities((prev) => ({...prev,[foodId]: (prev[foodId] || 0)+1}));
        // Optimistic update
        setCart(prev => {
            const updatedItems = {
                ...prev.items,
                [foodId]: (prev.items[foodId] || 0) + 1
            };

            return { items: updatedItems };
        });

        // Backend only needs +1
        await addToCart(foodId, user.token);
    };



    const decreaseQuantity = async (foodId) => {
        setQuantities((prev) => ({...prev,[foodId]: (prev[foodId] || 0)-1}));

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

        await removeQuantityFromCart(foodId, user.token);
    };


    // const removeFromCart = async (foodId) => {

    //     setCart(prev => {
    //         const updated = { ...prev.items };
    //         delete updated[foodId];
    //         return { items: updated };
    //     });

    //     await removeFromCartApi(foodId, user.token);
    // };


    const loadCartData = async(token) => {
        const items = await getCartData(token);
        console.log(token);
        setQuantities(items);
        console.log(items);
    }


  // 🔥 Fetch products from backend
    const fetchProducts = async (page = 0, searchTerm = "") => {
        try {
        setLoading(true);

        const response = await axios.get(
            `http://localhost:8080/api/product/getproducts?page=${page}&size=${pageSize}&search=${searchTerm}`
        );

        console.log("Got from content :",response.data.content);


        setProductList(response.data.content);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.number);

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
        quantities,
        user,
        setUser,
        fetchProducts,
        currentPage,
        setCurrentPage,
        totalPages,
        loading,
        search,
        setSearch,
        // loadCartData
    };



    useEffect(() =>{
        async function loadData(){
            const data = await fetchProducts();
            setProductList(data);
            // console.log(data);
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
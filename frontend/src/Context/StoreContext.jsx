import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list as defaultFoodList, pizzaData as defaultPizzaData } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [customCart, setCustomCart] = useState([]);
    const rawUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? window.location.origin : "http://localhost:4000");
    const url = rawUrl.replace(/\/+$/, "");
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [pizzaData, setPizzaData] = useState(defaultPizzaData);

    const addToCart = async (itemId) => {
        setCartItems((prev) =>
            !prev[itemId] ? { ...prev, [itemId]: 1 } : { ...prev, [itemId]: prev[itemId] + 1 }
        );
        try {
            if (token) {
                await axios.post(`${url}/api/cart/add`, { itemId }, {
                    headers: { token },
                });
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updated = { ...prev, [itemId]: prev[itemId] - 1 };
            if (updated[itemId] <= 0) delete updated[itemId];
            return updated;
        });
        try {
            if (token) {
                await axios.post(`${url}/api/cart/remove`, { itemId }, {
                    headers: { token },
                });
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const addCustomToCart = (customPizza) => {
        setCustomCart((prev) => [...prev, customPizza]);
    };

    const removeCustomFromCart = (index) => {
        setCustomCart((prev) => prev.filter((_, i) => i !== index));
    };

    const clearCart = () => {
        setCartItems({});
        setCustomCart([]);
    };

    const getTotalCartAmount = () => {
        let total = 0;
        for (let itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const item = food_list.find((food) => food._id === itemId);
                if (item) {
                    total += item.price * cartItems[itemId];
                }
            }
        }
        for (let pizza of customCart) {
            total += (pizza.price || 0) * (pizza.quantity || 1);
        }
        return total;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success && response.data.data && response.data.data.length > 0) {
                setFoodList(response.data.data);
            } else {
                setFoodList(defaultFoodList);
            }
        } catch (error) {
            console.error("Error fetching food list, using fallback:", error);
            setFoodList(defaultFoodList);
        }
    };

    const loadCartData = async (userToken) => {
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, {
                headers: { token: userToken },
            });
            setCartItems(response.data.cartData || {});
        } catch (error) {
            console.error("Error loading cart data:", error);
            setCartItems({});
        }
    };

    const fetchCartFromServer = async () => {
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, {
                headers: { token },
            });
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        if (token) {
            fetchCartFromServer();
        }
    }, [token]);

    const contextValue = {
        food_list,
        pizzaData,
        setPizzaData,
        cartItems,
        setCartItems,
        customCart,
        setCustomCart,
        addToCart,
        removeFromCart,
        addCustomToCart,
        removeCustomFromCart,
        clearCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;

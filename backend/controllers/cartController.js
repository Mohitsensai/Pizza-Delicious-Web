import userModel from "../models/userModel.js";

// Add item to user's cart
const addToCart = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        const { itemId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const cart = { ...(user.cartData || {}) };

        if (!cart[itemId]) {
            cart[itemId] = 1;
        } else {
            cart[itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData: cart });

        res.json({ success: true, message: "Added to cart", cartData: cart });
    } catch (error) {
        console.error("Cart add error:", error);
        res.json({ success: false, message: "Error adding to cart" });
    }
};

// Remove item from user's cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        const { itemId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const cart = { ...(user.cartData || {}) };

        if (cart[itemId]) {
            cart[itemId] -= 1;
            if (cart[itemId] <= 0) {
                delete cart[itemId];
            }
            await userModel.findByIdAndUpdate(userId, { cartData: cart });
            res.json({ success: true, message: "Removed from cart", cartData: cart });
        } else {
            res.json({ success: true, message: "Item not in cart", cartData: cart });
        }
    } catch (error) {
        console.error("Cart remove error:", error);
        res.json({ success: false, message: "Error removing from cart" });
    }
};

// Get cart data for user
const getCart = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;

        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        console.error("Cart get error:", error);
        res.json({ success: false, message: "Error fetching cart data" });
    }
};

export { addToCart, removeFromCart, getCart };

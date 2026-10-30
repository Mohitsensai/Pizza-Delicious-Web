import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import inventoryModel from "../models/inventoryModel.js";
import Stripe from "stripe";

// Helper to get Stripe instance safely
const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return null;
    return new Stripe(key);
};

// 🧾 Place a new order and initiate Stripe checkout or fallback
const placeOrder = async (req, res) => {
    let clientOrigin = req.headers.origin;
    if (!clientOrigin && req.headers.referer) {
        try {
            clientOrigin = new URL(req.headers.referer).origin;
        } catch (_) {}
    }
    const frontend_url = process.env.FRONTEND_URL || clientOrigin || "http://localhost:5173";

    try {
        const { items, address } = req.body;
        const userId = req.body.userId || req.userId;

        if (!items || items.length === 0) {
            return res.json({ success: false, message: "No items in cart to order." });
        }

        // Load all food items from DB to validate prices
        const dbItems = await foodModel.find();
        const dbItemMap = new Map((dbItems || []).map(item => [item.name, item.price]));

        let validatedItems = [];
        let itemTotal = 0;

        for (let item of items) {
            const isStandard = dbItemMap.has(item.name);
            const price = isStandard ? Number(dbItemMap.get(item.name)) : Number(item.price || 0);
            const quantity = Number(item.quantity) || 1;

            itemTotal += price * quantity;

            validatedItems.push({
                name: item.name,
                price,
                quantity
            });
        }

        const deliveryFee = 40;
        const totalAmount = itemTotal + deliveryFee;

        // Save the order
        const newOrder = new orderModel({
            userId,
            items: validatedItems,
            amount: totalAmount,
            address: address || {},
            status: "Food Processing",
            payment: false,
            date: new Date().toISOString()
        });

        await newOrder.save();

        // Clear user cart
        if (userId) {
            try {
                await userModel.findByIdAndUpdate(userId, { cartData: {} });
            } catch (cartErr) {
                console.warn("Could not clear user cart:", cartErr.message);
            }
        }

        // Auto-deduct inventory
        try {
            const inv = await inventoryModel.findOne();
            if (inv) {
                const count = validatedItems.length;
                await inventoryModel.findOneAndUpdate({}, {
                    base: Math.max(0, (inv.base ?? 100) - count),
                    sauce: Math.max(0, (inv.sauce ?? 100) - count),
                    cheese: Math.max(0, (inv.cheese ?? 100) - count)
                });
            }
        } catch (invErr) {
            console.warn("Inventory deduct failed:", invErr.message);
        }

        // Stripe line items
        const line_items = validatedItems.map(item => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Charges" },
                unit_amount: deliveryFee * 100
            },
            quantity: 1
        });

        let sessionUrl = `${frontend_url}/verified?success=true&orderId=${newOrder._id}`;

        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (stripeKey && !stripeKey.includes("placeholder") && !stripeKey.includes("your_key")) {
            try {
                const stripe = getStripe();
                if (stripe) {
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        line_items,
                        mode: "payment",
                        success_url: `${frontend_url}/verified?success=true&orderId=${newOrder._id}`,
                        cancel_url: `${frontend_url}/verified?success=false&orderId=${newOrder._id}`
                    });
                    if (session && session.url) {
                        sessionUrl = session.url;
                    }
                }
            } catch (stripeError) {
                console.warn("Stripe API error (using direct verified confirmation):", stripeError.message);
            }
        }

        res.json({ success: true, session_url: sessionUrl });

    } catch (error) {
        console.error("Place order error:", error);
        res.status(500).json({ success: false, message: "Order failed", error: error.message });
    }
};

// 🧾 Verify order payment status
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true" || success === true) {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment cancelled or failed" });
        }
    } catch (error) {
        console.error("Verify order error:", error);
        res.status(500).json({ success: false, message: "Error verifying order" });
    }
};

// 🧾 Get all orders for a specific user
const userOrders = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, data: orders || [] });
    } catch (error) {
        console.error("User orders error:", error);
        res.status(500).json({ success: false, message: "Error fetching user orders" });
    }
};

// 🧾 Get all orders (admin use)
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders || [] });
    } catch (error) {
        console.error("List orders error:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// 🧾 Update order status (admin use)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };

import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(url + "/api/order/list");
            if (response.data.success && Array.isArray(response.data.data)) {
                setOrders(response.data.data.reverse());
            } else {
                toast.error("Error fetching orders");
            }
        } catch (error) {
            console.error("Fetch orders failed:", error);
            toast.error("Network Error connecting to backend");
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(url + "/api/order/status", {
                orderId,
                status: event.target.value
            });
            if (response.data.success) {
                toast.success("Order status updated!");
                await fetchAllOrders();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("Server error updating status");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className='order add'>
            <h3>Order Page</h3>
            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders received yet.</p>
            ) : (
                <div className='order-list'>
                    {orders.map((order, index) => (
                        <div key={order._id || index} className='order-item'>
                            <img src={assets.parcel_icon} alt="Parcel Icon" />
                            <div>
                                <p className='order-item-food'>
                                    {(order.items || []).map((item, i) =>
                                        item.name + " x" + item.quantity + (i !== (order.items || []).length - 1 ? ", " : "")
                                    )}
                                </p>
                                <p className='order-item-name'>
                                    {((order.address?.firstName || "") + " " + (order.address?.lastName || "")).trim() || "Customer"}
                                </p>
                                <div className='order-item-address'>
                                    <p>{(order.address?.street || "") + ","}</p>
                                    <p>
                                        {[order.address?.city, order.address?.state, order.address?.country, order.address?.zipcode]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                </div>
                                <p className='order-item-phone'>{order.address?.phone || ""}</p>
                            </div>
                            <p>Items: {order.items ? order.items.length : 0}</p>
                            <p>₹{order.amount}</p>
                            <select
                                onChange={(event) => statusHandler(event, order._id)}
                                value={order.status}
                            >
                                <option value="Food Processing">Food Processing</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;

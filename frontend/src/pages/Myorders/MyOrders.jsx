import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.post(
                url + "/api/order/userorders",
                {},
                { headers: { token } }
            );
            if (response.data.success && Array.isArray(response.data.data)) {
                setData(response.data.data.reverse());
            } else {
                setData([]);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            {loading ? (
                <p>Loading your orders...</p>
            ) : (
                <div className='container'>
                    {!data || data.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        data.map((order, index) => (
                            <div key={order._id || index} className="my-orders-order">
                                <img src={assets.parcel_icon} alt="Parcel Icon" />
                                <p>
                                    {(order.items || [])
                                        .map((item) => `${item.name} x ${item.quantity}`)
                                        .join(', ')}
                                </p>
                                <p>₹{order.amount}.00</p>
                                <p>Items: {order.items ? order.items.length : 0}</p>
                                <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                                <button onClick={fetchOrders} title="Refresh order status">Track Order</button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MyOrders;

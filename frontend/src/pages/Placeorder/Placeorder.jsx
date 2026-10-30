import React, { useContext, useEffect, useState } from 'react';
import './Placeorder.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Placeorder = () => {
    const {
        cartItems,
        customCart,
        food_list,
        url,
        token
    } = useContext(StoreContext);

    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const standardSubtotal = Object.keys(cartItems).reduce((total, id) => {
        const item = food_list.find(i => i._id === id);
        return item ? total + item.price * cartItems[id] : total;
    }, 0);

    const customSubtotal = customCart.reduce((total, pizza) => {
        return total + (pizza.price || 0) * (pizza.quantity || 1);
    }, 0);

    const subtotal = standardSubtotal + customSubtotal;
    const deliveryFee = subtotal === 0 ? 0 : 40;
    const total = subtotal + deliveryFee;

    useEffect(() => {
        if (!token || total === 0) {
            navigate('/cart');
        }
    }, [token, total, navigate]);

    const prepareItems = () => {
        const items = [];

        for (let itemId in cartItems) {
            const quantity = cartItems[itemId];
            if (quantity > 0) {
                const food = food_list.find(item => item._id === itemId);
                if (food) {
                    items.push({
                        name: food.name,
                        price: food.price,
                        quantity
                    });
                }
            }
        }

        for (let pizza of customCart) {
            items.push({
                name: pizza.name || "Custom Pizza",
                price: Number(pizza.price || 0),
                quantity: Number(pizza.quantity || 1)
            });
        }

        return items;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!token) return alert("Please login to place your order.");

        const items = prepareItems();
        const address = { ...data };

        try {
            const response = await axios.post(`${url}/api/order/place`, {
                items,
                amount: total,
                address
            }, {
                headers: { token }
            });

            if (response.data.success) {
                window.location.href = response.data.session_url;
            } else {
                alert("Failed to initiate payment.");
            }
        } catch (error) {
            console.error("Order error:", error.response?.data || error.message);
            alert("Something went wrong: " + (error.response?.data?.message || error.message));
        }
    };


    return (
        <div className="place-order-container">
            <form className='place-order' onSubmit={onSubmitHandler}>
                <div className="place-order-left">
                    <p className='title'>Delivery Information</p>

                    <div className="multi-fields">
                        <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' required />
                        <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' required />
                    </div>

                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' required />
                    <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' required />

                    <div className="multi-fields">
                        <input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' required />
                        <input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' required />
                    </div>

                    <div className="multi-fields">
                        <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='ZIP Code' required />
                        <input name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' required />
                    </div>

                    <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' required />
                </div>

                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>Cart Totals</h2>
                        <div className="cart-total-details">
                            <p>Subtotal (Standard)</p>
                            <p>₹{standardSubtotal.toFixed(2)}</p>
                        </div>
                        <div className="cart-total-details">
                            <p>Subtotal (Custom)</p>
                            <p>₹{customSubtotal.toFixed(2)}</p>
                        </div>
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>₹{deliveryFee.toFixed(2)}</p>
                        </div>
                        <div className="cart-total-details total-bold">
                            <p>Total</p>
                            <p>₹{total.toFixed(2)}</p>
                        </div>
                        <button type="submit">Proceed to Payment</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Placeorder;
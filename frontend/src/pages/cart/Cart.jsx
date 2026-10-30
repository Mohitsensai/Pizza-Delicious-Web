import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const {
        cartItems,
        food_list,
        removeFromCart,
        customCart,
        removeCustomFromCart,
        url,
    } = useContext(StoreContext);

    const navigate = useNavigate();

    const normalSubtotal = Object.keys(cartItems).reduce((total, id) => {
        const item = food_list.find((item) => item._id === id);
        return total + (item?.price || 0) * (cartItems[id] || 0);
    }, 0);

    const customSubtotal = customCart.reduce((total, item) => {
        return total + (item.price || 0) * (item.quantity || 1);
    }, 0);

    const isCartEmpty = normalSubtotal + customSubtotal === 0;
    const deliveryFee = isCartEmpty ? 0 : 40;
    const grandTotal = normalSubtotal + customSubtotal + deliveryFee;

    const handleCheckout = () => {
        if (isCartEmpty) {
            alert("Your cart is empty! Please add some delicious pizzas first.");
            return;
        }
        navigate("/order");
    };

    return (
        <div className="cart">
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <hr />

                {/* 🧾 Standard Pizza Items */}
                {food_list.map((item) => {
                    if (cartItems[item._id] > 0) {
                        const imgSrc = item.image?.startsWith("data:") || item.image?.startsWith("http") || item.image?.includes("/assets/")
                            ? item.image
                            : `${url}/images/${item.image}`;

                        return (
                            <div key={item._id} className="cart-items-title cart-items-item">
                                <img src={imgSrc} alt={item.name} />
                                <p>{item.name}</p>
                                <p>₹{item.price}</p>
                                <p>{cartItems[item._id]}</p>
                                <p>₹{item.price * cartItems[item._id]}</p>
                                <p onClick={() => removeFromCart(item._id)} className="cross">
                                    X
                                </p>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            <hr />

            {/* 🍕 Custom Pizza Items */}
            <div className="cart-items">
                {customCart.length > 0 && (
                    <>
                        <div className="cart-items-title">
                            <p>Items</p>
                            <p>Custom Pizza</p>
                            <p>Price</p>
                            <p>Quantity</p>
                            <p>Total</p>
                            <p>Remove</p>
                        </div>
                        <hr />
                        {customCart.map((item, index) => (
                            <div key={index} className="cart-items-title cart-items-item">
                                <img src={item.image} alt={item.name || "Custom Pizza"} />
                                <p>
                                    {item.name || "Custom Pizza"}
                                    <br />
                                    <span className="custom-desc">
                                        {item.base}, {item.sauce}, {item.cheese}, {item.veggie}
                                    </span>
                                </p>
                                <p>₹{item.price}</p>
                                <p>{item.quantity}</p>
                                <p>₹{item.price * item.quantity}</p>
                                <p onClick={() => removeCustomFromCart(index)} className="cross">
                                    X
                                </p>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <hr />

            {/* 🧾 Totals */}
            <div className="cart-bottom">
                <div className="cart-total">
                    <h1>Cart Total</h1>
                    <div className="cart-total-details">
                        <p>Subtotal (Standard)</p>
                        <p>₹{normalSubtotal.toFixed(2)}</p>
                    </div>
                    <div className="cart-total-details">
                        <p>Subtotal (Custom)</p>
                        <p>₹{customSubtotal.toFixed(2)}</p>
                    </div>
                    <div className="cart-total-details">
                        <p>Delivery Fee</p>
                        <p>₹{deliveryFee.toFixed(2)}</p>
                    </div>
                    <div className="cart-total-details">
                        <h2>Total</h2>
                        <h2>₹{grandTotal.toFixed(2)}</h2>
                    </div>
                    <button onClick={handleCheckout}>
                        PROCEED TO CHECKOUT
                    </button>
                </div>

                <div className="cart-promocode">
                    <p>If you have a promocode, paste it here:</p>
                    <div className="cart-promocode-input">
                        <input type="text" placeholder="Enter Promocode" />
                        <button className="submit-button">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

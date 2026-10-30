import React, { useContext } from 'react';
import './FoodDisplay.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import { Link } from 'react-router-dom';

const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext);

    const filteredFoods = food_list ? food_list.filter(item => category === "All" || category === item.category) : [];

    return (
        <div className="food-display-container">

            {/* ── Header ── */}
            <div className="best-seller">
                <h2 className="top-10" id="top-10">Top BestSellers</h2>
                <div className="flame-line" />
                <p className="locality-label" id="para">📍 In Your Locality</p>
            </div>

            {/* ── Grid ── */}
            <div className="food-display-list">

                {/* Regular food items filtered by category */}
                {filteredFoods.map((item) => (
                    <FoodItem
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.image}
                    />
                ))}

                {/* ── Customize Pizza Card ── */}
                <div className="custom-pizza-card">
                    <div className="img-wrap">
                        <img src={assets.food7} alt="Customize Pizza" />
                    </div>
                    <div className="custom-card-content">
                        <h3>Customize Pizza</h3>
                        <p>Customize every slice to 100% perfection — your crust, your sauce, your toppings.</p>
                        <Link to="/customize" className="customize-link">
                            <img src={assets.add_icon} alt="add" />
                            <span className="cta-text">Build It Now</span>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FoodDisplay;

import React, { useState, useContext } from "react";
import "./Customize.css";
import { assets, pizzaData, pizzas } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

const Customize = () => {
    const { addCustomToCart } = useContext(StoreContext);

    const pizzaImages = {
        pz001: assets.food1,
        pz002: assets.food2,
        pz003: assets.food3,
        pz004: assets.food4,
        pz005: assets.food5,
    };

    const [selections, setSelections] = useState({});

    const handleSelectionChange = (pizzaId, field, value) => {
        setSelections((prev) => ({
            ...prev,
            [pizzaId]: {
                ...prev[pizzaId],
                [field]: value
            }
        }));
    };

    const handleAddToCart = (pizza) => {
        const selected = selections[pizza._id] || {};
        const { bases, sauces, cheeses, veggies, quantity = 1 } = selected;

        if (!bases || !sauces || !cheeses || !veggies) {
            alert("Please select all options before adding to cart.");
            return;
        }

        const basePrice = pizzaData.bases.find((b) => b.name === bases)?.price || 0;
        const saucePrice = pizzaData.sauces.find((s) => s.name === sauces)?.price || 0;
        const cheesePrice = pizzaData.cheeses.find((c) => c.name === cheeses)?.price || 0;
        const veggiePrice = pizzaData.veggies.find((v) => v.name === veggies)?.price || 0;

        // Store UNIT PRICE so cart calculation (price * quantity) remains accurate!
        const unitPrice = basePrice + saucePrice + cheesePrice + veggiePrice;

        const customPizza = {
            name: pizza.name || "Custom Pizza",
            image: pizzaImages[pizza._id] || assets.food7,
            base: bases,
            sauce: sauces,
            cheese: cheeses,
            veggie: veggies,
            quantity: Number(quantity) || 1,
            price: unitPrice
        };

        addCustomToCart(customPizza);
        alert("Custom pizza added to cart!");
    };

    const renderPizzaOptions = (pizza) => {
        const selected = selections[pizza._id] || {};
        const quantity = Number(selected.quantity) || 1;

        const basePrice = pizzaData.bases.find((b) => b.name === selected.bases)?.price || 0;
        const saucePrice = pizzaData.sauces.find((s) => s.name === selected.sauces)?.price || 0;
        const cheesePrice = pizzaData.cheeses.find((c) => c.name === selected.cheeses)?.price || 0;
        const veggiePrice = pizzaData.veggies.find((v) => v.name === selected.veggies)?.price || 0;

        const unitPrice = basePrice + saucePrice + cheesePrice + veggiePrice;
        const totalPrice = unitPrice * quantity;

        return (
            <div className="customize1-left" key={pizza._id}>
                <img src={pizzaImages[pizza._id] || assets.food7} alt={pizza.name || "Pizza"} />
                <p>{pizza.name || "Custom Pizza"}</p>
                <p>{pizza.description || "Craft your personal pizza with fresh ingredients."}</p>
                <div className="customize1-left-button">
                    <h3>Select Base</h3>
                    <select onChange={(e) => handleSelectionChange(pizza._id, "bases", e.target.value)}>
                        <option value="">Select Base</option>
                        {pizzaData.bases.map((base, i) => (
                            <option key={i} value={base.name}>
                                {base.name} - ₹{base.price}
                            </option>
                        ))}
                    </select>

                    <h3>Select Sauce</h3>
                    <select onChange={(e) => handleSelectionChange(pizza._id, "sauces", e.target.value)}>
                        <option value="">Select Sauce</option>
                        {pizzaData.sauces.map((sauce, i) => (
                            <option key={i} value={sauce.name}>
                                {sauce.name} - ₹{sauce.price}
                            </option>
                        ))}
                    </select>

                    <h3>Select Cheese</h3>
                    <select onChange={(e) => handleSelectionChange(pizza._id, "cheeses", e.target.value)}>
                        <option value="">Select Cheese</option>
                        {pizzaData.cheeses.map((cheese, i) => (
                            <option key={i} value={cheese.name}>
                                {cheese.name} - ₹{cheese.price}
                            </option>
                        ))}
                    </select>

                    <h3>Select Veggies</h3>
                    <select onChange={(e) => handleSelectionChange(pizza._id, "veggies", e.target.value)}>
                        <option value="">Select Veggies</option>
                        {pizzaData.veggies.map((veggie, i) => (
                            <option key={i} value={veggie.name}>
                                {veggie.name} - ₹{veggie.price}
                            </option>
                        ))}
                    </select>

                    <h3>Quantity</h3>
                    <select onChange={(e) => handleSelectionChange(pizza._id, "quantity", Number(e.target.value))}>
                        {[...Array(10).keys()].map((num) => (
                            <option key={num + 1} value={num + 1}>
                                {num + 1}
                            </option>
                        ))}
                    </select>

                    <div className="custom-price">
                        <h3>
                            Price: ₹{totalPrice}/-
                            <img src={assets.add_to_cart2} alt="Add to Cart" />
                        </h3>
                    </div>

                    <button className="add-button" onClick={() => handleAddToCart(pizza)}>
                        Add to Cart
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="customize-page">
            <h1>Customize Your Pizza</h1>
            <div className="customize1">
                {pizzas.map((pizza) => renderPizzaOptions(pizza))}
            </div>
        </div>
    );
};

export default Customize;

import React from 'react';
import './Header.css';

const Header = () => {
    const handleScrollToMenu = () => {
        const menuElement = document.getElementById("exploreMenu");
        if (menuElement) {
            menuElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className='header'>
            <div className="header-contents">
                <h2>Explore the crust here...</h2>
                <p>"Craving something new? Explore a world of irresistible pizzas, bold flavours, cheesy goodness, and endless toppings -- all just a tap away!"</p>
                <button onClick={handleScrollToMenu}>View Menu</button>
            </div>
        </div>
    );
};

export default Header;

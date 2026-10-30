import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'



const Footer = () => {
    return (
    <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <Link to='/'><img src={assets.logo} alt="" className='logo1'/></Link>
                    <p>At Pizza Delicious , we don’t just bake pizzas — we craft edible joy! Our handcrafted crusts are golden and crispy, our sauces are slow-simmered to perfection, and our cheeses stretch with satisfaction. From garden-fresh veggies to premium meats, every topping is thoughtfully layered for maximum flavor. Whether you love it classic or custom, spicy or cheesy, your perfect pizza is just a slice away. One bite, and you’ll know — this is more than pizza... it’s passion.

</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.instagram_icon} alt="" />
                        <img src={assets.linkedin_icon} alt=""  />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>Company</h2>
                    <ul>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className='footer-content-right'>
                    <h2>Get In Touch</h2>
                    <ul>
                        <li>+91-8797194622</li>
                        <li>createmohit200@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr/>
            <p className="footer-copyright">Copyright © 2025 FoodShoot.com - All Right Reserved. </p>
        </div>
    )
}

export default Footer
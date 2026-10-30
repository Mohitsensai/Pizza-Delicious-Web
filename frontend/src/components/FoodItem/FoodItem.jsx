import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    const imgSrc = !image
        ? assets.food1
        : (typeof image === 'string' && (image.startsWith("data:") || image.startsWith("http") || image.includes("/assets/")))
            ? image
            : `${url}/images/${image}`;

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className="food-item-image" src={imgSrc} alt={name} />
                {!cartItems[id]
                    ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_green} alt='add' />
                    : <div className='food-item-counter'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt='remove' />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt='add' />
                    </div>
                }
            </div>
            <div className='food-item-info'>
                <div className='food-item-image-rating'>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="rating" />
                </div>
            </div>
            <p className="food-item-description">{description}</p>
            <p className="food-item-price">₹ {price}</p>
        </div>
    );
};

export default FoodItem;

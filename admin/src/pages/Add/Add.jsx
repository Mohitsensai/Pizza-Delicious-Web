import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ url }) => {
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Veg-Pizza",
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error("Please upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price) || 0);
        formData.append("category", data.category);
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData);

            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Veg-Pizza",
                });
                setImage(null);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                {/* Image Upload */}
                <div className='add-img-upload flex-col'>
                    <p>Upload Image</p>
                    <label htmlFor='image'>
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="Preview"
                        />
                    </label>
                    <input
                        type="file"
                        id='image'
                        accept="image/*"
                        hidden
                        required
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                {/* Name */}
                <div className='add-product-name flex-col'>
                    <p>Product Name</p>
                    <input
                        type="text"
                        name='name'
                        placeholder='Enter Pizza Name'
                        value={data.name}
                        onChange={onChangeHandler}
                        required
                    />
                </div>

                {/* Description */}
                <div className="add-product-description flex-col">
                    <p>Product Description</p>
                    <textarea
                        name="description"
                        placeholder="Enter Pizza Description"
                        value={data.description}
                        onChange={onChangeHandler}
                        required
                    ></textarea>
                </div>

                {/* Category & Price */}
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product Category</p>
                        <select name='category' value={data.category} onChange={onChangeHandler}>
                            <option value="Veg-Pizza">Veg-Pizza</option>
                            <option value="Non-Veg Pizza">Non-Veg Pizza</option>
                            <option value="Volcano Pizza">Volcano Pizza</option>
                            <option value="Chicken Burst">Chicken Burst</option>
                            <option value="cheesy">Cheesy</option>
                            <option value="Combo Feast">Combo Feast</option>
                        </select>
                    </div>

                    <div className="add-price flex-col">
                        <p>Product Price (₹)</p>
                        <input
                            type='number'
                            name='price'
                            placeholder='199'
                            value={data.price}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>
                </div>

                {/* Submit */}
                <button type='submit' className='add-button'>Add Item</button>
            </form>
        </div>
    );
};

export default Add;

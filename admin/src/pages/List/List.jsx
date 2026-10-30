import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success && Array.isArray(response.data.data)) {
                setList(response.data.data);
            } else {
                toast.error("Error fetching list");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to connect to backend");
        } finally {
            setLoading(false);
        }
    };

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
            if (response.data.success) {
                toast.success("Item removed");
                fetchList();
            } else {
                toast.error(response.data.message || "Failed to remove item");
            }
        } catch (err) {
            toast.error("Server error");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>
            {loading ? (
                <p>Loading food items...</p>
            ) : list.length === 0 ? (
                <p>No food items found. Add some above!</p>
            ) : (
                <div className='list-table'>
                    <div className='list-table-format title'>
                        <p>Image</p>
                        <p>Name</p>
                        <p>Category</p>
                        <p>Price</p>
                        <p>Action</p>
                    </div>
                    {list.map((item, index) => {
                        const imgSrc = item.image?.startsWith("http") || item.image?.startsWith("data:")
                            ? item.image
                            : `${url}/images/${item.image}`;

                        return (
                            <div key={item._id || index} className='list-table-format'>
                                <img src={imgSrc} alt={item.name} />
                                <p>{item.name}</p>
                                <p>{item.category}</p>
                                <p>₹{item.price}</p>
                                <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default List;

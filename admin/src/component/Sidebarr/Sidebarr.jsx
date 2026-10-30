import React from 'react';
import './Sidebarr.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebarr = () => {
    return (
        <div className='sidebar'>
            <div className='sidebar-options'>
                <NavLink to="/add" className='sidebar-option'>
                    <img src={assets.add_icon_green} alt='Add Items'/>
                    <p>Add Items</p>
                </NavLink>
                <NavLink to="/list" className='sidebar-option'>
                    <img src={assets.order_icon} alt='List Items'/>
                    <p>List Items</p>
                </NavLink>
                <NavLink to="/orders" className='sidebar-option'>
                    <img src={assets.parcel_icon} alt='Orders'/>
                    <p>Orders</p>
                </NavLink>
                <NavLink to="/inventory" className='sidebar-option'>
                    <img src={assets.order_icon} alt='Inventory'/>
                    <p>Inventory</p>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebarr;

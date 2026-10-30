import React from 'react'
import {assets} from '../../assets/assets'
import './Navbar.css'

const Navbar = () => {
    
    return (
        <div className='navbar'>
            <img className='logo' src={assets.logoimg} alt='Logo'/>
            <img className='profile' src={assets.profile_image} alt='Avatar'/>
            
        </div>
        
    )
}

export default Navbar
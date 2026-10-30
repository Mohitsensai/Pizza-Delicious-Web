import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPopUp from './components/LoginPopUp/LoginPopUp';
import Home from './pages/Home/Home';
import Cart from './pages/cart/Cart';
import Placeorder from './pages/Placeorder/Placeorder';
import Customize from './pages/Customize/Customize';
import Verified from './pages/Verified/Verified'; 
import MyOrders from './pages/Myorders/MyOrders';


const App = () => {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
            <div className='app'>
                <Navbar setShowLogin={setShowLogin} />
                <hr/>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/order' element={<Placeorder />} />
                    <Route path='/customize' element={<Customize />} />
                    <Route path="/verified" element={<Verified />} /> 
                    <Route path='/myorders' element={<MyOrders />} />
                    
                </Routes>
            </div>
            <Footer />
        </>
    );
};

export default App;

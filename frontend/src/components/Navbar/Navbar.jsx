import React, { useContext, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo2 from "./cart.png";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const { token, setToken, getTotalCartAmount } = useContext(StoreContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    return (
        <div className="navbar">
            <Link to="/">
                <img src={assets.logo} alt="Pizza Logo" className="logo1" />
            </Link>
            <ul className="navbar-menu">
                <Link to="/">
                    <li
                        onClick={() => setMenu("home")}
                        className={menu === "home" ? "active" : ""}
                    >
                        Home
                    </li>
                </Link>
                <li
                    onClick={() => {
                        setMenu("app");
                        document
                            .getElementById("app-download")
                            ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={menu === "app" ? "active" : ""}
                >
                    App
                </li>
                <li
                    onClick={() => {
                        setMenu("contact-us");
                        document
                            .getElementById("footer")
                            ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={menu === "contact-us" ? "active" : ""}
                >
                    Contact-us
                </li>

                <Link to="/myorders">
                    <li
                        onClick={() => setMenu("track-order")}
                        className={menu === "track-order" ? "active" : ""}
                    >
                        Track Order
                    </li>
                </Link>
            </ul>
            <div className="navbar-right">
                <div className="navbar-search">
                    <img src={assets.logo_search} alt="search" />
                </div>

                <div className="navbar-user-icon">
                    <Link to="/cart">
                        <img src={logo2} alt="Cart" />
                    </Link>
                    <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
                </div>
                {!token ? (
                    <button className="signup-btn" onClick={() => setShowLogin(true)}>
                        Sign-in
                    </button>
                ) : (
                    <div className="navbar-profile">
                        <img src={assets.Login} alt="profile" />
                        <ul className="nav-profile-dropdown">
                            <li onClick={() => navigate("/myorders")}>
                                <img src={assets.bag_icon} alt="orders" />
                                <p>Orders</p>
                            </li>

                            <hr />
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="logout" />
                                <p>Logout</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;

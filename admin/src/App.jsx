import React from "react";
import Navbar from "./component/Navbar/Navbar";
import Sidebarr from "./component/Sidebarr/Sidebarr";
import Orders from "./pages/Orders/Orders";
import List from "./pages/List/List";
import Add from "./pages/Add/Add";
import Inventory from "./pages/Inventory/Inventory";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const rawUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ? window.location.origin : "http://localhost:4000");
  const url = rawUrl.replace(/\/+$/, "");

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebarr />
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/inventory" element={<Inventory url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

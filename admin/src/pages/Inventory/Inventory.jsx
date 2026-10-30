import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Inventory.css";
import { toast } from "react-toastify";

const Inventory = ({ url }) => {
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${url}/api/inventory`);
            if (res.data.success && res.data.data) {
                setInventory(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch inventory:", err);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [url]);

    const onChange = (cat, key, val) => {
        const updated = { ...inventory };
        if (key) {
            if (!updated[cat]) updated[cat] = {};
            updated[cat][key] = Number(val);
        } else {
            updated[cat] = Number(val);
        }
        setInventory(updated);
    };

    const saveChanges = async () => {
        try {
            const res = await axios.post(`${url}/api/inventory/update`, inventory);
            if (res.data.success) {
                toast.success("Inventory Updated successfully!");
                if (res.data.data) setInventory(res.data.data);
            } else {
                toast.error(res.data.message || "Failed to update inventory");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error saving inventory changes");
        }
    };

    if (loading) return <p className="inventory-loading">Loading inventory data...</p>;
    if (!inventory) return <p className="inventory-loading">No inventory found.</p>;

    return (
        <div className="inventory">
            <h2>Inventory Dashboard</h2>
            <div className="section">
                <h3>Base / Sauce / Cheese</h3>
                {["base", "sauce", "cheese"].map((key) => (
                    <div key={key}>
                        <label>{key.toUpperCase()}</label>
                        <input
                            type="number"
                            value={inventory[key] ?? 0}
                            onChange={(e) => onChange(key, null, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div className="section">
                <h3>Veggies</h3>
                {inventory.veggies && Object.keys(inventory.veggies).map((item) => (
                    <div key={item}>
                        <label>{item}</label>
                        <input
                            type="number"
                            value={inventory.veggies[item] ?? 0}
                            onChange={(e) => onChange("veggies", item, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div className="section">
                <h3>Meat</h3>
                {inventory.meat && Object.keys(inventory.meat).map((item) => (
                    <div key={item}>
                        <label>{item}</label>
                        <input
                            type="number"
                            value={inventory.meat[item] ?? 0}
                            onChange={(e) => onChange("meat", item, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <button onClick={saveChanges} className="inventory-save-btn">Save Changes</button>
        </div>
    );
};

export default Inventory;

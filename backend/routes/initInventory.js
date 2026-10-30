// routes/initInventory.js
import express from 'express';
import inventoryModel from '../models/inventoryModel.js';
const router = express.Router();

router.post('/init-inventory', async (req, res) => {
    try {
        const existing = await inventoryModel.findOne();
        if (existing) return res.json({ success: false, message: "Inventory already exists" });

        const inventory = new inventoryModel({
            base: 100,
            sauce: 100,
            cheese: 100,
            veggies: {
                onion: 100,
                tomato: 100,
                capsicum: 100,
                olives: 100
            },
            meat: {
                chicken: 100,
                pepperoni: 100
            }
        });

        await inventory.save();
        res.json({ success: true, message: "Inventory initialized" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error initializing", error: err.message });
    }
});

export default router;

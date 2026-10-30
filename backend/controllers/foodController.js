import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import foodModel from "../models/foodModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../uploads");

// Add Food Controller
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const image_filename = req.file.filename;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            image: image_filename,
        });

        const saved = await food.save();
        res.status(201).json({ success: true, message: "Food item added successfully", data: saved });
    } catch (error) {
        console.error("Add food error:", error);
        res.status(500).json({ success: false, message: "Failed to add food item" });
    }
};

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods || [] });
    } catch (error) {
        console.error("List food error:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve food items" });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const id = req.body.id;
        const food = await foodModel.findById(id);
        if (food) {
            if (food.image) {
                const imgPath = path.resolve(uploadsDir, food.image);
                if (fs.existsSync(imgPath)) {
                    fs.unlink(imgPath, (err) => {
                        if (err) console.warn("Could not delete image file:", err.message);
                    });
                }
            }
            await foodModel.findByIdAndDelete(id);
            res.json({ success: true, message: "Food item removed successfully" });
        } else {
            res.json({ success: false, message: "Food item not found" });
        }
    } catch (error) {
        console.error("Remove food error:", error);
        res.status(500).json({ success: false, message: "Failed to remove food item" });
    }
};

export { addFood, listFood, removeFood };

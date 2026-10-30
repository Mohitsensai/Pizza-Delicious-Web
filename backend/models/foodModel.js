import mongoose from "mongoose";
import { isMongoConnected } from "../config/db.js";
import { storage } from "../config/storage.js";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
});

const MongooseFoodModel = mongoose.models.food || mongoose.model("food", foodSchema);

class FoodModelWrapper {
    constructor(data = {}) {
        this._id = data._id;
        this.name = data.name;
        this.description = data.description;
        this.price = Number(data.price);
        this.image = data.image;
        this.category = data.category;
    }

    async save() {
        if (isMongoConnected()) {
            const doc = new MongooseFoodModel({
                name: this.name,
                description: this.description,
                price: this.price,
                image: this.image,
                category: this.category
            });
            const saved = await doc.save();
            this._id = saved._id.toString();
            return saved;
        }
        const created = await storage.create("foods", {
            name: this.name,
            description: this.description,
            price: this.price,
            image: this.image,
            category: this.category
        });
        this._id = created._id;
        return created;
    }

    static async find(query = {}) {
        if (isMongoConnected()) {
            return await MongooseFoodModel.find(query);
        }
        return await storage.find("foods", query);
    }

    static async findOne(query) {
        if (isMongoConnected()) {
            return await MongooseFoodModel.findOne(query);
        }
        return await storage.findOne("foods", query);
    }

    static async findById(id) {
        if (isMongoConnected()) {
            return await MongooseFoodModel.findById(id);
        }
        return await storage.findById("foods", id);
    }

    static async findByIdAndDelete(id) {
        if (isMongoConnected()) {
            return await MongooseFoodModel.findByIdAndDelete(id);
        }
        return await storage.findByIdAndDelete("foods", id);
    }

    static async findByIdAndUpdate(id, update) {
        if (isMongoConnected()) {
            return await MongooseFoodModel.findByIdAndUpdate(id, update, { new: true });
        }
        return await storage.findByIdAndUpdate("foods", id, update);
    }
}

export default FoodModelWrapper;

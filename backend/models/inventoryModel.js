import mongoose from "mongoose";
import { isMongoConnected } from "../config/db.js";
import { storage } from "../config/storage.js";

const inventorySchema = new mongoose.Schema({
    base: { type: Number, default: 100 },
    sauce: { type: Number, default: 100 },
    cheese: { type: Number, default: 100 },
    veggies: {
        onion: { type: Number, default: 100 },
        tomato: { type: Number, default: 100 },
        capsicum: { type: Number, default: 100 },
        olives: { type: Number, default: 100 },
    },
    meat: {
        chicken: { type: Number, default: 100 },
        pepperoni: { type: Number, default: 100 },
    },
    lastUpdated: { type: Date, default: Date.now },
});

const MongooseInventoryModel = mongoose.models.inventory || mongoose.model("inventory", inventorySchema);

class InventoryModelWrapper {
    static async findOne() {
        if (isMongoConnected()) {
            return await MongooseInventoryModel.findOne();
        }
        return await storage.findOne("inventory");
    }

    static async create(data = {}) {
        if (isMongoConnected()) {
            return await MongooseInventoryModel.create(data);
        }
        return await storage.create("inventory", data);
    }

    static async findOneAndUpdate(query = {}, update = {}, options = { new: true, upsert: true }) {
        if (isMongoConnected()) {
            return await MongooseInventoryModel.findOneAndUpdate(query, update, options);
        }
        return await storage.findOneAndUpdate("inventory", query, update, options);
    }
}

export default InventoryModelWrapper;

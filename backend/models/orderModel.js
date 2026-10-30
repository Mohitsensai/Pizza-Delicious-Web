import mongoose from "mongoose";
import { isMongoConnected } from "../config/db.js";
import { storage } from "../config/storage.js";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false }
});

const MongooseOrderModel = mongoose.models.order || mongoose.model("order", orderSchema);

class OrderModelWrapper {
    constructor(data = {}) {
        this._id = data._id;
        this.userId = data.userId;
        this.items = data.items || [];
        this.amount = Number(data.amount) || 0;
        this.address = data.address || {};
        this.status = data.status || "Food Processing";
        this.date = data.date || new Date().toISOString();
        this.payment = data.payment || false;
    }

    async save() {
        if (isMongoConnected()) {
            const doc = new MongooseOrderModel({
                userId: this.userId,
                items: this.items,
                amount: this.amount,
                address: this.address,
                status: this.status,
                date: this.date,
                payment: this.payment
            });
            const saved = await doc.save();
            this._id = saved._id.toString();
            return saved;
        }
        const created = await storage.create("orders", {
            userId: this.userId,
            items: this.items,
            amount: this.amount,
            address: this.address,
            status: this.status,
            date: this.date,
            payment: this.payment
        });
        this._id = created._id;
        return created;
    }

    static async find(query = {}) {
        if (isMongoConnected()) {
            return await MongooseOrderModel.find(query);
        }
        return await storage.find("orders", query);
    }

    static async findById(id) {
        if (isMongoConnected()) {
            return await MongooseOrderModel.findById(id);
        }
        return await storage.findById("orders", id);
    }

    static async findByIdAndUpdate(id, update) {
        if (isMongoConnected()) {
            return await MongooseOrderModel.findByIdAndUpdate(id, update, { new: true });
        }
        return await storage.findByIdAndUpdate("orders", id, update);
    }

    static async findByIdAndDelete(id) {
        if (isMongoConnected()) {
            return await MongooseOrderModel.findByIdAndDelete(id);
        }
        return await storage.findByIdAndDelete("orders", id);
    }
}

export default OrderModelWrapper;

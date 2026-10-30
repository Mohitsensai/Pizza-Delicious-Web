import mongoose from "mongoose";
import { isMongoConnected } from "../config/db.js";
import { storage } from "../config/storage.js";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }
}, { minimize: false });

const MongooseUserModel = mongoose.models.user || mongoose.model("user", userSchema);

class UserModelWrapper {
    constructor(data = {}) {
        this._id = data._id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.cartData = data.cartData || {};
    }

    async save() {
        if (isMongoConnected()) {
            const doc = new MongooseUserModel({
                name: this.name,
                email: this.email,
                password: this.password,
                cartData: this.cartData
            });
            const saved = await doc.save();
            this._id = saved._id.toString();
            return saved;
        }
        const created = await storage.create("users", {
            name: this.name,
            email: this.email,
            password: this.password,
            cartData: this.cartData
        });
        this._id = created._id;
        return created;
    }

    static async find(query = {}) {
        if (isMongoConnected()) {
            return await MongooseUserModel.find(query);
        }
        return await storage.find("users", query);
    }

    static async findOne(query) {
        if (isMongoConnected()) {
            return await MongooseUserModel.findOne(query);
        }
        return await storage.findOne("users", query);
    }

    static async findById(id) {
        if (isMongoConnected()) {
            return await MongooseUserModel.findById(id);
        }
        return await storage.findById("users", id);
    }

    static async findByIdAndUpdate(id, update) {
        if (isMongoConnected()) {
            return await MongooseUserModel.findByIdAndUpdate(id, update, { new: true });
        }
        return await storage.findByIdAndUpdate("users", id, update);
    }
}

export default UserModelWrapper;

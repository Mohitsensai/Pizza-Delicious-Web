import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data');
const dbFilePath = path.join(dataDir, 'db.json');

const defaultData = {
    foods: [
        {
            _id: "67b001a1e000000000000001",
            name: "Veg Pizza",
            description: "Veg pizza is a delightful combination of fresh vegetables layered over a crispy crust.",
            price: 149,
            category: "Veg-Pizza",
            image: "food1_veg-pizza.png"
        },
        {
            _id: "67b001a1e000000000000002",
            name: "Non Veg",
            description: "The base starts with freshly kneaded dough, hand-stretched and baked to a golden crust.",
            price: 270,
            category: "Non-Veg Pizza",
            image: "food2_nonveg.png"
        },
        {
            _id: "67b001a1e000000000000003",
            name: "Margherita",
            description: "A thin layer of vibrant tomato sauce is spread evenly on the crust.",
            price: 169,
            category: "Volcano Pizza",
            image: "food3_marg.png"
        },
        {
            _id: "67b001a1e000000000000004",
            name: "Farmhouse",
            description: "Generous amounts of mozzarella cheese melt into a creamy, golden layer.",
            price: 170,
            category: "Volcano Pizza",
            image: "food4_farmhouse.png"
        },
        {
            _id: "67b001a1e000000000000005",
            name: "Peppy Paneer",
            description: "Peppy Paneer Pizza is a fusion favorite, blending Indian flavors with the classic Italian pizza.",
            price: 185,
            category: "Combo Feast",
            image: "food5_peppypaneer.png"
        },
        {
            _id: "67b001a1e000000000000006",
            name: "Pizza Mania",
            description: "Smooth, melted mozzarella cheese covers the entire surface, adding creaminess.",
            price: 220,
            category: "Combo Feast",
            image: "food6_pizzamania.png"
        }
    ],
    users: [],
    orders: [],
    inventory: {
        _id: "67b001a1e000000000000099",
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
        },
        lastUpdated: new Date().toISOString()
    }
};

class StorageEngine {
    constructor() {
        this.cache = null;
        this.init();
    }

    init() {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(dbFilePath)) {
            fs.writeFileSync(dbFilePath, JSON.stringify(defaultData, null, 2), 'utf-8');
            this.cache = JSON.parse(JSON.stringify(defaultData));
        } else {
            try {
                const raw = fs.readFileSync(dbFilePath, 'utf-8');
                this.cache = JSON.parse(raw);
                if (!this.cache.foods || this.cache.foods.length === 0) {
                    this.cache.foods = defaultData.foods;
                    this.saveSync();
                }
                if (!this.cache.inventory) {
                    this.cache.inventory = defaultData.inventory;
                    this.saveSync();
                }
            } catch (e) {
                console.error("Error reading db.json, creating fallback:", e.message);
                this.cache = JSON.parse(JSON.stringify(defaultData));
                this.saveSync();
            }
        }
    }

    generateId() {
        return crypto.randomBytes(12).toString('hex');
    }

    saveSync() {
        try {
            fs.writeFileSync(dbFilePath, JSON.stringify(this.cache, null, 2), 'utf-8');
        } catch (err) {
            console.error("Failed to persist db.json:", err.message);
        }
    }

    async find(collection, query = {}) {
        if (!this.cache[collection]) return [];
        let items = this.cache[collection];
        if (query && Object.keys(query).length > 0) {
            items = items.filter(item => {
                for (let key in query) {
                    if (String(item[key]) !== String(query[key])) return false;
                }
                return true;
            });
        }
        return JSON.parse(JSON.stringify(items));
    }

    async findOne(collection, query = {}) {
        if (collection === 'inventory') {
            return this.cache.inventory ? JSON.parse(JSON.stringify(this.cache.inventory)) : null;
        }
        if (!this.cache[collection]) return null;
        const item = this.cache[collection].find(entry => {
            for (let key in query) {
                if (String(entry[key]) !== String(query[key])) return false;
            }
            return true;
        });
        return item ? JSON.parse(JSON.stringify(item)) : null;
    }

    async findById(collection, id) {
        if (collection === 'inventory') {
            return this.cache.inventory ? JSON.parse(JSON.stringify(this.cache.inventory)) : null;
        }
        if (!this.cache[collection]) return null;
        const item = this.cache[collection].find(entry => String(entry._id) === String(id));
        return item ? JSON.parse(JSON.stringify(item)) : null;
    }

    async create(collection, data) {
        const id = data._id || this.generateId();
        const record = { ...data, _id: id };
        if (collection === 'inventory') {
            this.cache.inventory = record;
        } else {
            if (!this.cache[collection]) this.cache[collection] = [];
            this.cache[collection].push(record);
        }
        this.saveSync();
        return JSON.parse(JSON.stringify(record));
    }

    async findByIdAndUpdate(collection, id, update) {
        if (collection === 'inventory') {
            this.cache.inventory = { ...this.cache.inventory, ...update, lastUpdated: new Date().toISOString() };
            this.saveSync();
            return JSON.parse(JSON.stringify(this.cache.inventory));
        }
        if (!this.cache[collection]) return null;
        const idx = this.cache[collection].findIndex(entry => String(entry._id) === String(id));
        if (idx === -1) return null;
        this.cache[collection][idx] = { ...this.cache[collection][idx], ...update };
        this.saveSync();
        return JSON.parse(JSON.stringify(this.cache[collection][idx]));
    }

    async findByIdAndDelete(collection, id) {
        if (!this.cache[collection]) return null;
        const idx = this.cache[collection].findIndex(entry => String(entry._id) === String(id));
        if (idx === -1) return null;
        const [deleted] = this.cache[collection].splice(idx, 1);
        this.saveSync();
        return JSON.parse(JSON.stringify(deleted));
    }

    async findOneAndUpdate(collection, query = {}, update = {}, options = {}) {
        if (collection === 'inventory') {
            if (!this.cache.inventory && options.upsert) {
                this.cache.inventory = { ...defaultData.inventory, ...update, lastUpdated: new Date().toISOString() };
            } else if (this.cache.inventory) {
                this.cache.inventory = { ...this.cache.inventory, ...update, lastUpdated: new Date().toISOString() };
            }
            this.saveSync();
            return JSON.parse(JSON.stringify(this.cache.inventory));
        }
        let item = await this.findOne(collection, query);
        if (item) {
            return await this.findByIdAndUpdate(collection, item._id, update);
        }
        if (options.upsert) {
            return await this.create(collection, { ...query, ...update });
        }
        return null;
    }
}

export const storage = new StorageEngine();
export const defaultFoods = defaultData.foods;

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRoute.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import initInventoryRouter from './routes/initInventory.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure uploads folder exists
const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static images from both /images and /uploads
app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(uploadsDir));

// API Routes
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/inventory', inventoryRoutes);
app.use('/api', initInventoryRouter);

// Serve Admin Panel build if present
const adminDist = path.resolve(__dirname, '../admin/dist');
if (fs.existsSync(adminDist)) {
    app.use('/admin', express.static(adminDist));
    app.get(['/admin', '/admin/*'], (req, res) => {
        res.sendFile(path.resolve(adminDist, 'index.html'));
    });
}

// Serve Customer Frontend build if present
const frontendDist = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/images') || req.path.startsWith('/admin')) {
            return next();
        }
        res.sendFile(path.resolve(frontendDist, 'index.html'));
    });
} else {
    // Healthcheck route if frontend is hosted separately
    app.get('/', (req, res) => {
        res.json({ success: true, message: 'Pizza-dev Backend API is fully active and running!' });
    });
}

// Start server and connect DB
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
};

startServer();

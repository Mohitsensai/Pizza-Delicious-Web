import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads');

const foodRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        cb(null, `${Date.now()}_${sanitized}`);
    }
});

const upload = multer({ storage });

foodRouter.post('/add', upload.single('image'), addFood);
foodRouter.get("/list", listFood);
foodRouter.post('/remove', removeFood);

export default foodRouter;

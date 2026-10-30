import express from 'express';
import { getInventory, updateInventory } from '../controllers/inventoryController.js';
const router = express.Router();

router.get('/', getInventory);
router.post('/update', updateInventory);

export default router;

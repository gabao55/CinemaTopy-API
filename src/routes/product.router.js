import express from 'express';
import { listProducts, productDetails } from '../controllers/product.controller.js';

const router = express.Router();

router.get('/products', listProducts);
router.get('/product/:id', productDetails);

export default router;
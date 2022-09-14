import express from 'express';
import { addProductToCart } from '../controllers/cart.controller.js';
import authorizationMiddleware from '../middlewares/authorization.middleware.js';
import productsMiddleware from '../middlewares/cart.middleware.js';

const router = express.Router();

router.use(productsMiddleware);
router.use(authorizationMiddleware);

router.get('/cart/list-products');
router.post('/cart/add-product', addProductToCart);

export default router;
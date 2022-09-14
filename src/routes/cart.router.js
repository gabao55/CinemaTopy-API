import express from 'express';
import { addProductToCart, deleteCartProduct, listCartProducts } from '../controllers/cart.controller.js';
import authorizationMiddleware from '../middlewares/authorization.middleware.js';
import productsMiddleware from '../middlewares/cart.middleware.js';

const router = express.Router();

router.use(productsMiddleware);
router.use(authorizationMiddleware);

router.get('/cart/products', listCartProducts);
router.post('/cart/product', addProductToCart);
router.delete('/cart/product', deleteCartProduct);

export default router;
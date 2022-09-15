import express from 'express';
import { addProductToCart, cleanCart, deleteCartProduct, listCartProducts, updateProductAmount } from '../controllers/cart.controller.js';
import authorizationMiddleware from '../middlewares/authorization.middleware.js';
import productsMiddleware from '../middlewares/cart.middleware.js';

const router = express.Router();

router.use(authorizationMiddleware);

router.get('/cart/products', listCartProducts);
router.delete('/cart/products', cleanCart);

router.use(productsMiddleware);

router.put('/cart/product', updateProductAmount);
router.post('/cart/product', addProductToCart);
router.post('/cart/delete-product', deleteCartProduct);

export default router;
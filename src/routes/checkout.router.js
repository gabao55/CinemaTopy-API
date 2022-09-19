import express from 'express';
import authorizationMiddleware from '../middlewares/authorization.middleware.js'
import { addUserPurchaseDetails, checkoutPurchase, listPurchase } from '../controllers/checkout.controller.js';
import { validatePurchaseDetails } from '../middlewares/address.middleware.js';

const router = express.Router();

router.use(authorizationMiddleware);

router.get('/checkout', listPurchase);
router.put('/purchase-details', validatePurchaseDetails, addUserPurchaseDetails);
router.post('/checkout', checkoutPurchase);

export default router;
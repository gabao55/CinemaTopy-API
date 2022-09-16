import express from 'express';
import authorizationMiddleware from '../middlewares/authorization.middleware.js'
import { addUserPurchaseDetails, checkoutPurchase } from '../controllers/checkout.controller.js';
import { validateCheckout, validatePurchaseDetails } from '../middlewares/address.middleware.js';

const router = express.Router();

router.use(authorizationMiddleware);

router.put('/purchase-details', validatePurchaseDetails, addUserPurchaseDetails);
router.post('/checkout', checkoutPurchase);

export default router;
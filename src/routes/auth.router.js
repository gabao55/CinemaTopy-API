import express from 'express';
import { signIn, signUp, token } from '../controllers/auth.controller.js';
import authorizationMiddleware from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);

router.get("/token", authorizationMiddleware,token);

export default router;
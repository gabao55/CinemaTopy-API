import joi from 'joi';
import mongo from '../db/db.js';

const db = await mongo();

const addProductSchema = joi.object({
    userId: joi.string().hex().length(24).required(),
    productId: joi.string().hex().length(24).required(),
    amount: joi.number().integer().min(1).required(),
});

async function addProductToCart(req, res) {
    const validation = addProductSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(erros);
    }

    const user = res.locals.user;
    const product = res.locals.product;
    const { amount } = req.body;

    try {
        
        await db.collection('cartProducts').insertOne({
            userId: user._id,
            productId: product._id,
            amount,
        });

        res.sendStatus(200);

    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export { addProductToCart };
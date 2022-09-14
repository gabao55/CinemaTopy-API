import joi from 'joi';
import mongo from '../db/db.js';

const db = await mongo();

const addProductSchema = joi.object({
    userId: joi.string().hex().length(24).required(),
    productId: joi.string().hex().length(24).required(),
    amount: joi.number().integer().min(1).required(),
});

async function addProductToCart(req, res) {
    const user = res.locals.user;
    const validation = addProductSchema.validate({...req.body, userId: user._id.toString()}, { abortEarly: false });
    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(erros);
    }

    const product = res.locals.product;
    const { amount } = req.body;

    try {

        const isProductAdded = await db.collection('cartProducts').findOne({
            userId: user._id,
            productId: product._id
        });
        if (isProductAdded) {
            return res.status(422).send('Produto já foi adicionado ao carrinho');
        }
        
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

async function listCartProducts(req, res) {
    const user = res.locals.user;

    try {
        
        const cartProducts = await db.collection('cartProducts').find({ userId: user._id }).toArray();
        if (!cartProducts) {
            res.status(404).send('Erro ao processar produtos, tente novamente.');
        }

        const cartProductsInfo = [];

        for (let i = 0; i < cartProducts.length; i ++) {
            const productDetails = await db.collection('products').findOne({ _id: cartProducts[i].productId });
            
            cartProductsInfo.push({
                productDetails,
                amount: cartProducts[i].amount,
            });
        }

        res.send(cartProductsInfo);

    } catch (error) {
        return res.status(500).send(error.message);
    }
}

async function deleteCartProduct(req, res) {
    const user = res.locals.user;
    const product = res.locals.product;
    
    try {
        
        const cartProduct = await db.collection('cartProducts').findOne({
            userId: user._id,
            productId: product._id
        });
        if (!cartProduct) {
            return res.status(404).send('Produto não foi adicionado ao carrinho');
        }

        await db.collection('cartProducts').deleteOne({ _id: cartProduct._id });

        res.sendStatus(200);

    } catch (error) {
        return res.status(500).send(error.message);        
    }
}

export { addProductToCart, listCartProducts, deleteCartProduct };
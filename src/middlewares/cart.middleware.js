import { ObjectId } from "mongodb";
import mongo from "../db/db.js";

async function validProduct(req, res, next){
    const productId = new ObjectId(req.body.productId);

    try {

        const db = await mongo();

        const product = await db.collection('products').findOne({ _id: productId });
        if (!product) {
            return res.status(404).send('Produto não encontrado');
        }

        console.log("oi");
        
        res.locals.product = product;
        next();

    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export default validProduct;
import { ObjectId } from "mongodb";
import mongo from "../db/db.js";
import { cleanCart } from "./cart.controller.js";

const db = await mongo();

async function addUserPurchaseDetails(req, res) {
    const user = res.locals.user;
    const { state, street, number, complement, paymentMethod } = req.body;


    try {
        
        await db.collection('users').updateOne({ _id: user._id }, { $set: {
            address: {
                state,
                street,
                number,
                complement,
            },
            paymentMethod,
        }});

        return res.sendStatus(200);

    } catch (error) {
        return console.log(error);
    }
}

async function checkoutPurchase(req, res) {
    const user = res.locals.user;
    const products = req.body.products

    try {
        
        await db.collection('purchases').insertOne({
            userId: user._id,
            products,
        });

        const response = {
            name: user.name,
            email: user.email,
            address: user.address,
            products,
        }

        cleanCart(req, res);

        return res.status(200).send(response)

    } catch (error) {
        return res.status(500).send(error)
    }
}

export { addUserPurchaseDetails, checkoutPurchase };
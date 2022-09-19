import mongo from "../db/db.js";
import sgMail from '@sendgrid/mail';
import { ObjectId } from "mongodb";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const db = await mongo();

async function addUserPurchaseDetails(req, res) {
    const user = res.locals.user;
    const { state, street, number, complement, paymentMethod } = req.body;


    try {

        const purchaseDetails = {
            address: {
                state,
                street,
                number,
                complement,
            },
            paymentMethod,
        }
        
        await db.collection('users').updateOne({ _id: user._id }, { $set: purchaseDetails});

        const userData = {
            ...user,
            ...purchaseDetails
        }

        return res.status(200).send(userData);

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

        const productsList = [];

        for (let i = 0; i < products.length; i ++) {
            const productDetails = await db.collection('products').findOne({ _id: new ObjectId(products[i].productId) });
            
            productsList.push(productDetails.name);
        }
    
        
        const msg = {
            to: response.email,
            from: 'cinematopy@gmail.com',
            subject: 'Confirmação de pedido - CinemaTopy',
            text: 'Email simulação de compra',
            html: `
                <h1>ESTE EMAIL É MERAMENTE ILUSTRATIVO, NÃO SERÁ ENVIADO NENHUM PEDIDO</h1>
                <h2>Obrigado por pedir na CinemaTopy</h2>
                <p>O pedido feito por ${response.name} será entregue em ${response.address.street}, ${response.address.number} ${response.address.complement} - ${response.address.state}</p>
                <p>Produtos: ${productsList.join(', ')}</p>
            `,
        };

        sgMail
        .send(msg)
        .then(() => {}, error => {
            console.error(error);

            if (error.response) {
            console.error(error.response.body)
            }
        });
        
        (async () => {
        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error);

            if (error.response) {
            console.error(error.response.body)
            }
        }
        })();

        return res.status(200).send(response)

    } catch (error) {
        return res.status(500).send(error)
    }
}

async function listPurchase(req, res) {
    const user = res.locals.user;
    try {
        const purchases = await db.collection("purchases").find({userId: user._id}).toArray();
        const obj = {
            purchases,
            paymentMethod: user.paymentMethod,
            address: user.address,
            name: user.name,
            email: user.email
        };
        res.status(200).send(obj);
      } catch (error) {
        res.status(500).send(error.message);
      }
} 

export { addUserPurchaseDetails, checkoutPurchase, listPurchase };
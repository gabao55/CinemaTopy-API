import mongo from '../db/db.js';
import { ObjectId } from "mongodb";

const db = await mongo();

async function listProducts(req, res) {
    try {
        const products = await db.collection("products").find().toArray();
        if (!products) {
          res.status(404).send("Nenhum produto foi encontrado!");
          return;
        }
        res.status(200).send(products);
      } catch (error) {
        res.status(500).send(error.message);
      }
}

async function productDetails(req, res) {
    try {
        const product = await db.collection("products").findOne({ _id: new ObjectId(req.params.id) });
        if (!product) {
          res.status(404).send("Produto não encontrado!");
          return;
        }
        res.status(200).send(product);
      } catch (error) {
        res.status(500).send(error.message);
      }
}

export { listProducts, productDetails };
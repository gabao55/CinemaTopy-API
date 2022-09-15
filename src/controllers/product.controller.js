import mongo from '../db/db.js';

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

export { listProducts };
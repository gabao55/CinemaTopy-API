import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from '../src/routes/auth.router.js';
import cartRouter from '../src/routes/cart.router.js';
import productRouter from '../src/routes/product.router.js';
import mongo from './db/db.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(productRouter);
app.use(authRouter);
app.use(cartRouter);

let db = await mongo();

setInterval( async () => {
  const realTime = Date.now();
  const HOURS_2 = 1000 * 60 * 60 * 2;

  try {
    const tokens = await db.collection("sessions").find().toArray();

    tokens.map( async (e) => {
      if(realTime - e.creatTime > HOURS_2){
        await db
          .collection("sessions")
          .deleteOne({_id: e._id});
      }
    });
  } catch (error) {
    console.log(error);
  }
}, 60000);

// Route for testing app
app.get('/status', (req, res) => {
    res.send('ok');
    return;
});
app.listen(process.env.PORT_API, () => console.log(`Listening to PORT ${process.env.PORT_API}`));
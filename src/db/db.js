import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let db;

const mongoClient = MongoClient.connect(process.env.MONGO_URI);

try {
    await mongoClient.connect();
} catch (error) {
    console.log(error);
}

db = mongoClient.db('ecommerce');

export default db;
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import EnvVars from "@src/constants/EnvVars";

export const collections: { mongoUser?: mongoDB.Collection } = {}

export async function connectToDb(){
    dotenv.config();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(EnvVars.mongoUri);
    await client.connect();
    const db: mongoDB.Db = client.db(EnvVars.dbName);
    const mongoUserCollection: mongoDB.Collection = db.collection('mongoUser');
    collections.mongoUser = mongoUserCollection;
    console.log(`connected to db ${db.databaseName} and colection ${mongoUserCollection.collectionName}`);
}
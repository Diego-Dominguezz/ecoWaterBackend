import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import  MongoPlant  from '../models/mongoPlant.model';

export const mongoPlantRoutes = express.Router();

mongoPlantRoutes.get('/', async(req:Request, res:Response) => {
    try {
        const plants = (await collections.mongoPlant.find({}).toArray()) as unknown as MongoPlant[];
        res.send(200).send(plants);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
mongoPlantRoutes.post('/', async(req: Request, res: Response) =>{
    try {
        const newPlant = req.body as MongoPlant;
        const result = await collections.mongoPlant.insertOne(newPlant);
        result? res.status(201).send(`planta creada con el id ${result.insertedId}`) : res.status(500).send("fallida creacion de planta");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
})
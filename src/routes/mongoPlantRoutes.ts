import { ObjectId } from 'mongodb';
import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import  MongoPlant  from '../models/mongoPlant.model';

export const mongoPlantRoutes = express.Router();

mongoPlantRoutes.get('/', async(req:Request, res:Response) => {
    try {
        const plants = (await collections.mongoPlant.find({}).toArray()) as unknown as MongoPlant[];
        res.status(200).send(plants);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
mongoPlantRoutes.get('/:id', async(req:Request, res:Response) =>{
    try {
        const id = req?.params?.id;
        const query = {_id: new ObjectId(id) };
        const result = (await collections.mongoPlant.findOne(query)) as unknown as MongoPlant;
        if (result) res.status(200).send(result);
    } catch (error) {
        console.error(error.message)
        res.status(404).send(`No se pudo encontrar elemento con id: ${req.params.id}`);
    }
})
mongoPlantRoutes.post('/', async(req: Request, res: Response) =>{
    try {
        const newPlant = req.body as MongoPlant;
        const result = await collections.mongoPlant.insertOne(newPlant);
        result? res.status(201).send(`planta creada con el id ${result.insertedId}`) : res.status(500).send("fallida creacion de planta");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ObjectId } from 'mongodb';
import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import  MongoPlant  from '../models/mongoPlant.model';
import { randomUUID } from 'crypto';

export const mongoPlantRoutes = express.Router();

mongoPlantRoutes.get('/', async(req:Request, res:Response) => {
    try {
        const plants = (await collections.mongoPlant.find({}).toArray()) as unknown as MongoPlant[];
        return res.status(200).send(plants);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error.message);
    }
});
mongoPlantRoutes.get('/:id', async(req:Request, res:Response) =>{
    try {
        const id = req?.params?.id;
        const query = {_id: new ObjectId(id) };
        const result = (await collections.mongoPlant.findOne(query)) as unknown as MongoPlant;
        if (result) return res.status(200).send(result);
        return res.status(500).send('result not found')
    } catch (error) {
        console.error(error.message)
        return res.status(404).send(`No se pudo encontrar elemento con id: ${req.params.id}`);
    }
})
mongoPlantRoutes.post('/', async(req: Request, res: Response) =>{
    try {
        let newPlant = req.body as MongoPlant;
        newPlant.waterSchedule.id = randomUUID();
        newPlant.plantStats.id = randomUUID();
        newPlant.plantStats.humidity = `${randomIntFromInterval(0,100)}%`
        newPlant.plantStats.timesWatered = randomIntFromInterval(0,100);
        newPlant.plantStats.hitpoints = randomIntFromInterval(5,100);
        newPlant.plantStats.daysAlive = randomIntFromInterval(0,500);
        const result = await collections.mongoPlant.insertOne(newPlant);
        newPlant.id = result.insertedId;
        await collections.mongoPlant.updateOne({ _id: new ObjectId(result.insertedId as unknown as string)}, {$set:newPlant});
        return result? res.status(201).send({message:`planta creada con el id ${result.insertedId}`, plant: newPlant}) : res.status(500).send("fallida creacion de planta");
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.message);
    }
});
mongoPlantRoutes.put('/', async (req: Request, res: Response) =>{
    try {
        let editPlant = req.body as MongoPlant;
        console.info('updating plant...', editPlant.id);
        const result = await collections.mongoPlant.updateOne({ _id: new ObjectId(editPlant.id)}, {$set:editPlant});
        console.log(result);
        return result ? res.status(201).send({ message: `planta editada con el id ${editPlant.id}`, plant: editPlant }) : res.status(500).send("fallida edicion de planta");
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.message);
    }
})
mongoPlantRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = (await collections.mongoPlant.deleteOne(query)) as unknown as MongoPlant;
        return res.status(200).send(result);
    } catch (error) {
        console.error(error.message)
        return res.status(404).send(`No se pudo encontrar elemento con id: ${req.params.id}`);
    }
})


// local functions
function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
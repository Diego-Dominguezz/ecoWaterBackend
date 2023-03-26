import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import mongoUser from "../models/mongoUser.model";

export const mongoUserRoutes = express.Router();

mongoUserRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const users = (await collections.mongoUser.find({}).toArray()) as unknown as mongoUser[];
        res.status(200).send(users);
    } catch (error) {
        console.error(error.message)
        res.status(500).send(error.message)
    }
})
mongoUserRoutes.get('/:id', async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        const query = {_id: new ObjectId(id)};
        const user = (await collections.mongoUser.findOne(query)) as unknown as mongoUser;
        if( user ) res.status(200).send(user);
    } catch (error) {
        console.error(error.message)
        res.status(404).send(`No se pudo encontrar elemento con id: ${req.params.id}`);
    }
})
mongoUserRoutes.post("/", async (req: Request, res: Response) => {
    try {
        const newUser = req.body as mongoUser;
        const result = await collections.mongoUser.insertOne(newUser);
        result ? res.status(201).send(`Creado usuario con el id ${result.insertedId}`) : res.status(500).send("Fallida creacion de usuario.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});
mongoUserRoutes.put('/:id', async( req:Request, res:Response) =>{
    const id = req?.params?.id;
    try {
        const updatedUser: mongoUser = req.body as mongoUser;
        const query = {_id: new ObjectId(id)};

        const result = await collections.mongoUser.updateOne(query, {$set : updatedUser});
        result ? res.status(200).send(`Usuario actualizado con el id ${id}`) : res.status(304).send(`Usuario con el id: ${id} no fue actualizado`);
    } catch (error) {
        res.status(400).send(error.message);
    }
})
mongoUserRoutes.delete('/:id', async (req:Request, res: Response)=>{
    const id = req?.params?.id;
    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.mongoUser.deleteOne(query);

        if (result && result.deletedCount){
            res.status(200).send(`usuario con el id ${id} eliminado`);
        } else if (!result){
            res.status(400).send(`no se pudo eliminar el usuario ${id}`);
        } else if (!result.deletedCount){
            res.status(404).send(`usuario con id ${id} no existe`);
        }
    } catch (error) {
        console.error(error.message)
        res.status(400).send(error.message);
    }
})
mongoUserRoutes.use(express.json());
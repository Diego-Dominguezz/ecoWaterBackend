import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import server from './server';
import EnvVars from './constants/EnvVars';
import { mongoUserRoutes } from './routes/mongoUserRoutes';
import { connectToDb } from './services/database.service';
import cors from 'cors';
import express from 'express';
import { mongoPlantRoutes } from './routes/mongoPlantRoutes';


// **** Run **** //

const SERVER_START_MSG = ('Express server started on port: ' + EnvVars.Port.toString());
// dominios permitidos para solicitar recursos desde este servicio
const allowedOrigins = ['http://localhost:8100'];

const options: cors.CorsOptions = {
    origin: allowedOrigins,
};

connectToDb().then(()=>{
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    server.use(cors(options));
    server.use(express.json());
    server.use("/Auth", mongoUserRoutes);
    server.use("/plants", mongoPlantRoutes);
    server.listen(EnvVars.Port, ()=>{
        logger.info(SERVER_START_MSG);
    })
})
.catch((err:Error)=>{
    logger.err(`db connection failed ${err.message}`);
    // eslint-disable-next-line no-process-exit
    process.exit();
})
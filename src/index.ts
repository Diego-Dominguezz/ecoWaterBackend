import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import server from './server';
import EnvVars from './constants/EnvVars';
import { mongoUserRoutes } from './routes/mongoUserRoutes';
import { connectToDb } from './services/database.service';


// **** Run **** //

const SERVER_START_MSG = ('Express server started on port: ' + EnvVars.Port.toString());

connectToDb().then(()=>{
    server.use("/Auth", mongoUserRoutes);
    server.listen(EnvVars.Port, ()=>{
        logger.info(SERVER_START_MSG);
    })
})
.catch((err:Error)=>{
    logger.err(`db connection failed ${err.message}`);
    // eslint-disable-next-line no-process-exit
    process.exit();
})
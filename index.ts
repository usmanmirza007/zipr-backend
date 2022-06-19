import express from 'express'
// require('dotenv').config()
import cors from 'cors'




import { services } from './src/services/index'

const app = express();

// Middlewares
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
// Mount REST on /api
app.use(express.json())
app.use(cors(corsOptions));
app.use('/api', services);
app.use(function (err:any, req: any, res:any, next:any) {
        res.status(500).json({message: err.message}) // <== YOUR JSON DATA HERE
})


const port = 8000;

app.listen(port, () =>
    console.log(`Express app listening on localhost:${port}`)
);
